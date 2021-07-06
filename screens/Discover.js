import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps'
import React, { useState, useRef, useEffect } from 'react';
import * as Location from 'expo-location';
import { Button, ButtonGroup, Card, Icon, Input, Modal, Spinner } from '@ui-kitten/components';
import API_URL from '../api/API_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapViewDirections from 'react-native-maps-directions';
import * as Progress from 'react-native-progress';
import { Camera } from 'expo-camera'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
const mapStyle = require('../assets/mapStyle.json')
function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}
function toRad(Value) {
  return Value * Math.PI / 180;
}
const Discover = ({ route }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([])
  const [curLoc, setCurLoc] = useState(null)

  const [position, setPosition] = useState(null)
  const [gettingPosition, setGettingPosition] = useState(true)
  const mapRef = useRef(null);
  const [activeBounty, setActiveBounty] = useState(null)
  /* const [showActiveBounties, setShowActiveBounties] = useState(false)
  const [showSuggestedRoute, setShowSuggestedRoute] = useState(false)  */


  /*   
      compute suggested route 
    update my location button or live tracking
      check in system and progress
      make sure to show both route and both points calculation calculate longitude delta
      add account type
      You're moving at : plus 1 for cycling (encourage route)
      if started working then fill up person limit realtime
      when started working on bounty have animation fighting it
      people map out pokestops
      see direct impact of donations
      different colors and custom map directions view
      dayu plan out trip realtime wallet updating
      on click bounty, update all or just one
      right and left find closest instead
      view instead of modal

      blockchain project
      hackathons and hackerrank and kaggle

      //cannot update during existing state
  */
  useEffect(() => {
    getBounties()


  }, [route.params])
  useEffect(() => {
    myLocation()

  }, [])
  async function getActiveBounty(loc) {
    fetch(`${API_URL.api}/api/bounty/getActive`, {
      headers: {
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"
    }).then(result => result.json()).then(result => {
      if (!result.hasOwnProperty('msg')) {
        setActiveBounty(result)
        calculateViewingBox(result, loc)
      }

    })
  }
  async function myLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    else {


      let location = await Location.getCurrentPositionAsync({});
      getActiveBounty(location.coords)
      setPosition(location.coords)
    }
    setGettingPosition(false)

  }


  async function getBounties() {
    fetch(`${API_URL.api}/api/bounty/get`, {
      headers: {

        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"
    }).then(result => result.json()).then(result => {
      setMarkers(result)
      if (route.params && route.params.id) {
        let obj = result.find(item => item.id == route.params.id)

        changeRegion(obj)
      }
    })
  }

  function findClosest(isLeft) {
    var closest = null
    var least = 10000000000
    for (var i = 0; i < markers.length; i++) {
      let dist = calcCrow(markers[i].lat, markers[i].lng, curLoc.lat, curLoc.lng)
      let check = isLeft ? markers[i].lat > curLoc.lat : markers[i].lat < curLoc.lat

      if (check && dist < least && markers[i].id != curLoc.id) {
        least = dist
        closest = markers[i]
      }


    }
    if (closest) {
      changeRegion(closest)

    }
  }
  function changeRegion(obj) {
    setCurLoc(obj)
    mapRef.current.animateToRegion({
      latitude: obj.lat,
      longitude: obj.lng,
      latitudeDelta: 0.007,
      longitudeDelta: 0.007,

    })
  }
  function moveToUser() {
    mapRef.current.animateToRegion({
      latitude: position.latitude,
      longitude: position.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002
    })
    mapRef.current.animateToBearing(80);
    mapRef.current.animateToViewingAngle(90);
  }
  async function createActiveBounty(bounty) {

    let data = { "bounty": bounty.id }
    fetch(`${API_URL.api}/api/bounty/createActive`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"



    }).then(result => result.json()).then(response => {
      setCurLoc(null)
      //calculateViewingBox(response, position)
      setActiveBounty(response)
      
    })
  }
  const midpoint = ([x1, y1], [x2, y2]) => [(x1 + x2) / 2, (y1 + y2) / 2];
  function calculateViewingBox(active, loc) {
    console.log(loc)
    console.log(active)
    let lat = active.bounty.lat
    let lng = active.bounty.lng

    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    let mid = midpoint([lat, lng], [loc.latitude, loc.longitude])
    let centerLat = mid[0]
    let centerLng = mid[1]
    
    let latDelta = Math.abs(lat - loc.latitude)
    latDelta *= 7
    const lngDelta = latDelta * ASPECT_RATIO;
    

    mapRef.current.animateToRegion({
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta
    })
  }
  

  return (
    <View
      style={{
        flex: 1,
      }}>{!errorMsg ?
        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          ref={mapRef}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: 22.3193,
            longitude: 114.1694, latitudeDelta: 0.0922, longitudeDelta: 0.0421
          }} style={styles.map}>
          {activeBounty && position ?
            <ActiveBounty activeBounty={activeBounty} setActiveBounty={setActiveBounty}  position={position} />
            :
            <>
              {position && <Marker

                coordinate={position}
                title={"This is Me"}
                description={"Fight the Fires!"}

              />}{
                markers.map((marker, index) => (
                  <Marker
                    key={index}
                    coordinate={{ longitude: marker.lng, latitude: marker.lat }}
                    title={marker.title}
                    description={marker.description}
                    onPress={() => { setCurLoc(marker) }}

                  >
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 13 }}>
                      <Image
                        source={require('../images/bounty.png')}
                        style={{ width: 26, height: 28 }}
                        resizeMode="contain"
                      />
                      <Timer marker={marker} />
                    </View>
                    <Callout tooltip={true} />
                  </Marker>
                ))}

              <Button style={{ position: 'absolute', right: 5, top: 5 }} onPress={() => { moveToUser() }} accessoryLeft={props => <Icon name="navigation-2-outline" {...props} />}></Button>
              
              <Modal visible={gettingPosition}  style={{ backgroundColor: "white", padding: 20, borderRadius: 15 }}><Spinner style={{ position: 'absolute' }} /></Modal>{/*
          <Button accessoryLeft={props => <Icon name="checkmark-circle-outline" {...props} />} style={{ position: 'absolute', left: 5, top: 5 }} onPress={() => setShowActiveBounties(true)} ></Button>

          <Modal visible={showActiveBounties} onBackdropPress={() => setShowActiveBounties(false)} backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: "#fff", padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}><Text style={{ color: "black", fontSize: 19, fontWeight: "600" }}>Duration: {activeBounties.reduce((a, b) => +a + +b.bounty.duration, 0)} hours</Text></View>
            {activeBounties.length ? <>{activeBounties.map(c => (
              <TouchableOpacity key={c.id} onPress={() => { setShowActiveBounties(false); changeRegion(markers.findIndex(e => e.id == c.bounty.id), markers) }} style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>{c.bounty.title}</Text>
              </TouchableOpacity>
            ))}
              <Button onPress={() => { setShowSuggestedRoute(true); setShowActiveBounties(false) }} accessoryLeft={props => <Icon {...props} name="map-outline" />}><Text>Suggested Route</Text></Button>
            </> : <View style={{ backgroundColor: "white", padding: 15, borderRadius: 10 }}><Text style={{ fontSize: 20 }}>No Active Bounties</Text></View>}
              
          </Modal>
          {showSuggestedRoute &&
            <MapViewDirections
              origin={position}
              optimizeWaypoints={true}
              destination={position}
              waypoints={activeBounties.map(c => ({ latitude: c.bounty.lat, longitude: c.bounty.lng }))}
              apikey="AIzaSyAPOOnlu8YXdWsyM3uUkz3tU7AeDWgoQqA"
              strokeWidth={4}
              strokeColor={"#3863ba"
              }
            />} */}
            </>}
        </MapView> : <View style={{
          alignItems:
            'center', padding: 20
        }}><Button status="control" onPress={() => setErrorMsg(null)} style={{ alignSelf: 'flex-start' }} accessoryLeft={props => <Icon {...props} name="chevron-left-outline" />}>Back</Button><Image source={require('../images/location.png')} style={{ width: 125, height: 125 }} resizeMode='contain' /><Text style={{ fontSize: 30 }}>OOPS!</Text><Text style={{ fontSize: 15 }}>Please turn on location services!</Text></View>
      }
      {curLoc && position && <BountyInfo createActiveBounty={createActiveBounty} bounty={curLoc} setBounty={setCurLoc} findClosest={findClosest} />
      }
    </View>
  )
}
function ActiveBounty({activeBounty,setActiveBounty,position}){
  let bounty = activeBounty.bounty
  const [showActiveBountyCancel,setShowActiveBountyCancel]=useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageData,setImageData]=useState(null)
  const [text,setText]=useState("")
  async function cancelActiveBounty(){
    fetch(`${API_URL.api}/api/bounty/cancelActive`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"



    }).then(()=>{
      setActiveBounty(null)
      setShowActiveBountyCancel(false)
    })
    
  }
  async function startWorking() {
    setActiveBounty({ ...activeBounty, started: true })
    fetch(`${API_URL.api}/api/bounty/startWorking`, {
      method: 'PUT',
      body: JSON.stringify({ bounty: bounty.id }),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"



    })
  }
  async function checkCameraPermission() {
    const { status } = await Camera.requestPermissionsAsync();
    cameraModeOn(status === 'granted');

  }
  function cameraModeOn(permission) {
    if (permission == false) {
      alert("Please turn on camera permissions in your app settings")

    }
    else {
      setShowCamera(true)
    }
  }
  async function takePicture() {
    const photoData = await camera.takePictureAsync({base64:true});
    setShowCamera(false)
    setImagePreview(photoData.uri)
    setImageData(/* 'data:image/jpeg;base64,' +  */photoData.base64)
  }

  // Converts numeric degrees to radians

  async function submitForReview() {
    fetch(`${API_URL.api}/api/bounty/submitActive`, {
      method: 'POST',
      body: JSON.stringify({ photo: imageData,text:text}),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"
    }).then(response=>response.json()).then(response=>{
      console.log(response)
      setShowSubmit(false)
      setActiveBounty({ ...activeBounty, review: true })
    })
  }
  return (
    <><Marker

              coordinate={position}
              title={"This is Me"}
              description={"Go to the Bounty"}

            />
            <Modal backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}  onBackdropPress={()=>setShowActiveBountyCancel(false)} visible={showActiveBountyCancel}>
              <View style={{backgroundColor:"white",padding:20,borderRadius:10}}>
                <Text style={{fontSize:30,fontWeight:"500",textAlign:'center'}}>
                Are you sure 
                </Text>
                <Text style={{marginVertical:10}}>
                  you want to cancel this bounty?
                </Text>
                <Button accessoryLeft={props => <Icon name="close-circle-outline" style={{ width: 20, height: 20 }} {...props} />} onPress={cancelActiveBounty}> 500 coins </Button>
              </View>
            </Modal>
              <Marker

                coordinate={{ latitude: activeBounty.bounty.lat, longitude: activeBounty.bounty.lng }}
                title={"Bounty"}
                description={"Come here"}

              /><MapViewDirections
                origin={position}

                destination={{ latitude: activeBounty.bounty.lat, longitude: activeBounty.bounty.lng }}
                apikey="AIzaSyAPOOnlu8YXdWsyM3uUkz3tU7AeDWgoQqA"
                strokeWidth={4}
                strokeColor={"#fff"
                }
              /><Modal visible={true} style={{position:'absolute',bottom:0,backgroundColor:"white",width:"100%",padding:10,top: Dimensions.get("window").height - 200 }}>
                <Button onPress={() => setShowActiveBountyCancel(true)} status="control" accessoryLeft={props => <Icon name="close-outline" style={{ width: 20, height: 20 }} {...props} />}>Cancel</Button>
                <View style={{ marginVertical: 15, alignItems: 'center' }} >{activeBounty.started ? (calcCrow(position.latitude, position.longitude, bounty.lat, bounty.lng) < 0.3 ? <Button style={{ width: "100%" }} onPress={() => startWorking()}>Start Working!</Button> : <><Progress.Bar color="#E84C3D" progress={0.3} width={300} /><View style={{ borderRadius: 3, alignSelf: 'center', padding: 15, margin: 5, backgroundColor: "#E84C3D", width:300}}><Text style={{ color: "white" }}>First Step: Move to Bounty</Text></View></>) :!activeBounty.review?<><Progress.Bar color="#E84C3D" progress={1} width={300} /><View style={{ borderRadius: 3, alignSelf: 'center', padding: 15, margin: 5, backgroundColor: "#E84C3D", width:300}}><Text style={{ color: "white" }}>Final Step: Awaiting Approval</Text></View></>: <><Progress.Bar color="#E84C3D" progress={0.6} width={300} /><View style={{ margin: 5 }}><Button onPress={() => setShowSubmit(true)}>Second Step: Submit Work for Review</Button></View></>}</View>

                </Modal>{/* swipe up for current bounty  */}
  
  <Modal visible={showSubmit} backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onBackdropPress={() => setShowSubmit(false)}>{!showCamera ? <View style={{ width: 250 }}><Input value={text} onChangeText={e=>setText(e)} accessoryLeft={props => <Icon {...props} name="text-outline" />} placeholder="Optional Text.." />
        {imagePreview ? <View style={{ height: 400, marginVertical: 10 }}><Button style={{ position: 'absolute', zIndex: 1, right: 0 }} status="control" accessoryLeft={props => <Icon name="close-square-outline" {...props} />} onPress={() => setImagePreview(null)}></Button><Image style={{ borderRadius: 10, flex: 1, }} source={{ uri: imagePreview }} /></View> : <Button onPress={checkCameraPermission} status="success" style={{ marginVertical: 10 }} accessoryLeft={props => <Icon {...props} name="camera-outline" />}>Optional: Take Picture</Button>}

        <Button onPress={submitForReview}>Submit</Button></View> :
        <Camera ref={ref => {
          setCamera(ref);
        }} style={{ flex: 1, width: Dimensions.get('window').width - 80, height: Dimensions.get('window').height - 80 }} type={type}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between'
            }}>
            <Button onPress={() => {
              setShowCamera(false)
            }} style={{ margin: 20 }} accessoryLeft={props => <Icon name="arrow-circle-left-outline" {...props} />}></Button>
            <Button status="success" onPress={takePicture} style={{ margin: 20 }} accessoryLeft={props => <Icon name="camera-outline" {...props} />}></Button>
            <Button accessoryLeft={props => <Icon name="refresh-outline" {...props} />} style={{ margin: 20 }} onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}></Button>

          </View>
        </Camera>
      }</Modal></>)
}
function BountyInfo({ createActiveBounty, bounty, setBounty, findClosest }) {
  const [modalHeight, setHeight] = useState(null)
  

  function findHeight(layout) {
    const { x, y, width, height } = layout;
    setHeight(height)
  }

  

  return (
      <Modal visible={true} style={{ width: '100%', position: 'absolute', top: Dimensions.get("window").height - modalHeight }} >
        <Card style={{ height: modalHeight }} disabled={true} onLayout={(event) => { findHeight(event.nativeEvent.layout) }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: "darkgrey" }}>{bounty.type} Event</Text>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}><Text style={{ textDecorationLine: 'underline', textDecorationColor: "red", fontSize: 30 }}>{bounty.title}</Text><View style={{ borderRadius: 5, backgroundColor: "#9F3737", marginHorizontal: 5 }}><Text style={{ color: "white", padding: 3 }}>{bounty.numPeople == 1 ? "Individual" : bounty.numPeople + " people"}</Text></View></View>
              <Text style={{ marginVertical: 5 }}>{bounty.amount} Bounty Credits</Text></View>
            <Button onPress={() => setBounty(null)} status="control" accessoryLeft={props => <Icon name="close-outline" style={{ width: 20, height: 20 }} {...props} />}></Button>

          </View>
          <Text style={{ color: "grey" }}>{bounty.description}</Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}><Text>Started By: {bounty.user.username}</Text><ButtonGroup ><Button onPress={() => findClosest(true)} accessoryLeft={(props) => <Icon {...props} name="chevron-left-outline" />}></Button><Button onPress={() => findClosest(false)} accessoryLeft={(props) => <Icon {...props} name="chevron-right-outline" />}></Button></ButtonGroup>
          </View><Button onPress={() => { createActiveBounty(bounty) }} style={{ marginVertical: 10 }} status="success">Start</Button> 
        </Card>
      </Modal>
      
  )
}
function Timer({ marker }) {
  let expiry = new Date(marker.expiry)
  const [timeLeft, setTimeLeft] = useState(expiry - Date.now())
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(expiry - Date.now())
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function twoDigits(num) {
    return (num < 10 && "0") + num
  }
  return (<View style={{ backgroundColor: "#E84C3D", borderRadius: 10, padding: 2 }}>
    <Text style={{ color: "white" }}>{timeLeft > 0 ? twoDigits(parseInt(timeLeft / (1000 * 60 * 60)) % 24) + ":" + twoDigits(parseInt(timeLeft / (1000 * 60)) % 60) + ":" + twoDigits(parseInt(timeLeft / (1000)) % 60) : "EXPIRED"}</Text>
  </View>)
}
const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },

  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#f19f53",
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 1
  },
  appButtonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center"
  }

})

export default Discover;