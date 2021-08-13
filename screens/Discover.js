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
import { Ionicons } from '@expo/vector-icons';
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
    leaderboard
    
    realize impact by green travel and bounties
    analyze speed, only if using car
    select current option, if following path and speed then +1
    have multiple travel options displayed
    plan day trip with times for lunch all laid out
    view history, impact, etc
  snap n reuse?

      blockchain project
      hackathons and hackerrank and kaggle

    move lal to main page redux and channels when accept
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

          mapRef.current.fitToCoordinates([{latitude:result.bounty.lat,longitude:result.bounty.lng},loc], {
            edgePadding: {
              right: 100,
              bottom: 200,
              left: 100,
              top: 100
            }
          });
        

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
      /* setPosition((await Location.watchPositionAsync(
        {
          enableHighAccuracy: false,
          distanceInterval: 1,
          timeInterval: 10000
        },
        error => console.log(error)
      )).coords) */


      
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

    let data = { "bounty": bounty.id,"lat":position.longitude,"lng":position.latitude }
    fetch(`${API_URL.api}/api/bounty/createActive`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"



    }).then(result => result.json()).then(response => {
      response = { ...response, bounty: curLoc }
      setActiveBounty(response)
      setCurLoc(null)
      mapRef.current.fitToCoordinates([{latitude:response.bounty.lat,longitude:response.bounty.lng},loc], {
        edgePadding: {
          right: 100,
          bottom: 200,
          left: 100,
          top: 100
        }
      });

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
            <ActiveBounty activeBounty={activeBounty} setActiveBounty={setActiveBounty} position={position} />
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

              

              
            </>}
        </MapView> : <View style={{
          alignItems:
            'center', padding: 20
        }}><Button status="control" onPress={() => setErrorMsg(null)} style={{ alignSelf: 'flex-start' }} accessoryLeft={props => <Icon {...props} name="chevron-left-outline" />}>Back</Button><Image source={require('../images/location.png')} style={{ width: 125, height: 125 }} resizeMode='contain' /><Text style={{ fontSize: 30 }}>OOPS!</Text><Text style={{ fontSize: 15 }}>Please turn on location services!</Text></View>
      }
      <Button style={{ position: 'absolute', right: 5, top: 5 }} onPress={() => { if(position){moveToUser()} }} accessoryLeft={props => <Icon name="navigation-2-outline" {...props} />}></Button>
      {curLoc && position && !activeBounty && <BountyInfo createActiveBounty={createActiveBounty} bounty={curLoc} setBounty={setCurLoc} findClosest={findClosest} />
      }
    </View>
  )
}
function ActiveBounty({ activeBounty, setActiveBounty, position }) {
  let bounty = activeBounty.bounty
  const [showActiveBountyCancel, setShowActiveBountyCancel] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageData, setImageData] = useState(null)
  const [text, setText] = useState("")
  const [transport,setTransport]=useState("DRIVING")
  const [emissions,setEmissions]=useState(null)
  async function cancelActiveBounty() {
    fetch(`${API_URL.api}/api/bounty/cancelActive`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"



    }).then(() => {
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
    const photoData = await camera.takePictureAsync({ base64: true });
    setShowCamera(false)
    setImagePreview(photoData.uri)
    setImageData(photoData.base64)
  }


  async function submitForReview() {
    fetch(`${API_URL.api}/api/bounty/submitActive`, {
      method: 'POST',
      body: JSON.stringify({ photo: imageData, text: text }),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"
    }).then(response => response.json()).then(response => {
      console.log(response)
      setShowSubmit(false)
      setActiveBounty({ ...activeBounty, review: true })
    })
  }
  async function getTransportEmissions(distance){
    fetch(`${API_URL.api}/api/bounty/emissions?distance=${distance}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"
    }).then(response => response.json()).then(response => {
      setEmissions(response)
    })
  }
 let imgs={"DRIVING":require('../images/DRIVING.png'),
 "BICYCLING":require('../images/BICYCLING.png'),
 "TRANSIT":require('../images/TRANSIT.png'),
 "WALKING":require('../images/WALKING.png')}
  return (
    <><Marker
      coordinate={{latitude: activeBounty.lat, longitude: activeBounty.lng}}
      title={"This is Me"}
      description={"Go to the Bounty"}
    ></Marker>
    <Marker
      coordinate={{latitude:position,longitude:position.longitude}}
      title={"This is Me"}
      description={"Go to the Bounty"}
      
    ><Image style={{width:40,height:40,tintColor:"#eee"}} source={imgs[transport]}></Image></Marker>
      <Modal backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onBackdropPress={() => setShowActiveBountyCancel(false)} visible={showActiveBountyCancel}>
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 30, fontWeight: "500", textAlign: 'center' }}>
            Are you sure
          </Text>
          <Text style={{ marginVertical: 10 }}>
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
        mode={transport}
        onReady={result => {
          console.log(`Distance: ${result.distance} km`)
          getTransportEmissions(result.distance)
         
        }}
        onError={(errorMessage) => {
          // console.log('GOT AN ERROR');
        }}

        destination={{ latitude: activeBounty.bounty.lat, longitude: activeBounty.bounty.lng }}
        apikey="AIzaSyAPOOnlu8YXdWsyM3uUkz3tU7AeDWgoQqA"
        strokeWidth={4}
        strokeColor={"#fff"
        }
      /><Modal visible={true} style={{ position: 'absolute', bottom: 0, backgroundColor: "white", width: "100%", padding: 10, top: Dimensions.get("window").height - 275 }}>
        <View style={{top:-30,position:'absolute',right:20,borderWidth:4,borderColor:"#eee",borderRadius:10}}><Button onPress={() => setShowActiveBountyCancel(true)} status="warning" accessoryLeft={props => <Icon name="close-outline" style={{ width: 20, height: 20, }} {...props} />}></Button></View>
        <View style={{ marginBottom: 15, alignItems: 'center',marginTop:30 }} >{!activeBounty.started ? (calcCrow(position.latitude, position.longitude, bounty.lat, bounty.lng) < 0.3 ? <Button style={{ width: "100%" }} onPress={() => startWorking()}>Start Working!</Button> : <><Progress.Bar color="#E84C3D" progress={0.3} width={300} /><View style={{ borderRadius: 3, alignSelf: 'center', padding: 15, margin: 5, backgroundColor: "#E84C3D", width: 300 }}><Text style={{ color: "white" }}>First Step: Move to Bounty</Text>
        </View>
        <View style={{display:"flex",flexDirection:"row",width:300}}>
        <TouchableOpacity onPress={()=>setTransport("DRIVING")} style={transport=="DRIVING"?styles.activeTransit:styles.transitOption} ><Ionicons name="md-car" size={32} color="#E84C3D" /><Text >Car</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>setTransport("BICYCLING")} style={transport=="BICYCLING"?styles.activeTransit:styles.transitOption} ><Ionicons name="md-bicycle" size={32} color="#E84C3D" /><Text>Bicycle</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>setTransport("WALKING")} style={transport=="WALKING"?styles.activeTransit:styles.transitOption} ><Ionicons name="md-walk" size={32} color="#E84C3D" /><Text>Walk</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>setTransport("TRANSIT")} style={transport=="TRANSIT"?styles.activeTransit:styles.transitOption} ><Ionicons name="md-train" size={32} color="#E84C3D" /><Text>Transit</Text></TouchableOpacity>
        </View>
        
          {emissions&&(transport=="WALKING"||transport=="BICYCLING"?<Text style={{backgroundColor:"#199B6E",padding:10,marginTop:10,color:"white",width:300}}>{transport} is a great way to help save the environment. It is an entirely green travel solution that is healthy as well!</Text>:transport=="DRIVING"?<Text style={{backgroundColor:"#E84C3D",padding:10,marginTop:10,color:"white",width:300}}>Riding a car would take around {emissions["car-trees"]}% of a fully grown tree to offset your carbon emissions.</Text>:<Text style={{backgroundColor:"#f39c11",padding:10,marginTop:10,color:"white",width:300}}>Great job taking public transport. It will only take {emissions["transit-trees"]}% of a tree to offset your trip's carbon emission.</Text>)}

        </>) : activeBounty.review ? <><Progress.Bar color="#E84C3D" progress={1} width={300} /><View style={{ borderRadius: 3, alignSelf: 'center', padding: 15, margin: 5, backgroundColor: "#E84C3D", width: 300 }}><Text style={{ color: "white" }}>Final Step: Awaiting Approval</Text></View></> : <><Progress.Bar color="#E84C3D" progress={0.6} width={300} /><View style={{ margin: 5 }}><Button onPress={() => setShowSubmit(true)}>Second Step: Submit Work for Review</Button></View></>}</View>

      </Modal>{/* swipe up for current bounty  */}

      <Modal visible={showSubmit} backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onBackdropPress={() => setShowSubmit(false)}>{!showCamera ? <View style={{ width: 250 }}><Input value={text} onChangeText={e => setText(e)} accessoryLeft={props => <Icon {...props} name="text-outline" />} placeholder="Optional Text.." />
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
  const [modalHeight, setHeight] = useState(275)


  /* function findHeight(layout) {
    const { x, y, width, height } = layout;
    setHeight(height)
  } 
  full Height modal if expand read more description*/



  return (
    <Modal visible={true} style={{ width: '100%', position: 'absolute', top: Dimensions.get("window").height - modalHeight }} >
      <Card style={{ height: modalHeight }} disabled={true} /* onLayout={(event) => { findHeight(event.nativeEvent.layout) }} */>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: "darkgrey" }}>{bounty.type} Event</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}><Text style={{ textDecorationLine: 'underline', textDecorationColor: "#E84C3D", fontSize: 30 }}>{bounty.title}</Text><View style={{ borderRadius: 5, backgroundColor: "#9F3737", marginHorizontal: 5 }}><Text style={{ color: "white", padding: 3 }}>{bounty.numPeople == 1 ? "Individual" : bounty.numPeople + " people"}</Text></View></View>
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
  transitOption:{
    alignItems:'center',
   flex:1,borderWidth:2,borderColor:"#E84C3D",borderRadius:5,margin:1,padding:5,
   shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor:"white"
  },
  activeTransit:{
    alignItems:'center',
   flex:1,borderWidth:2,borderColor:"#E84C3D",borderRadius:5,margin:1,padding:5,
   shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor:"#f5f5f5"
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