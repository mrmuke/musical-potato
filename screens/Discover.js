import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps'
import React, { useState, useRef, useEffect, useCallback } from 'react';
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

      blockchain project
      hackathons and hackerrank and kaggle

      
i like calling random people
remember when 4th grade
steph fine
how yuo doing
how ics
its not like im hitting on u just u know 
already called samantha, etc
just bored 

i just forgot where u went

  */
  useEffect(() => {
    getBounties()


  }, [route.params])
  useEffect(() => {
    myLocation()

  }, [])

  async function myLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    else {


      let location = await Location.getCurrentPositionAsync({});
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
      response={...response,bounty:curLoc}
      setActiveBounty(response)
      setCurLoc(null)
      route.params.changeScreens({
        "activeBounty":{
          "activeBounty": response
        }
      });
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
      }}>

      <Button style={{ position: 'absolute', left: 30, top: 40, zIndex: 10 }} onPress={() => { moveToUser() }} accessoryLeft={props => <Icon name="navigation-2-outline" {...props} />}></Button>
    {!errorMsg ?
        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          ref={mapRef}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: 22.3193,
            longitude: 114.1694, latitudeDelta: 0.0922, longitudeDelta: 0.0421
          }} style={styles.map}>
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
            </>
        </MapView> : <View style={{
          alignItems:
            'center', padding: 20
        }}><Button status="control" onPress={() => setErrorMsg(null)} style={{ alignSelf: 'flex-start' }} accessoryLeft={props => <Icon {...props} name="chevron-left-outline" />}>Back</Button><Image source={require('../images/location.png')} style={{ width: 125, height: 125 }} resizeMode='contain' /><Text style={{ fontSize: 30 }}>OOPS!</Text><Text style={{ fontSize: 15 }}>Please turn on location services!</Text></View>
      }
      {curLoc && position && !activeBounty && <BountyInfo createActiveBounty={createActiveBounty} bounty={curLoc} setBounty={setCurLoc} findClosest={findClosest} />
      }
    </View>
  )
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
