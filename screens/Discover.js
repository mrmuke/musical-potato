import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps'
import React, { useState, useEffect, createRef } from 'react';
import * as Location from 'expo-location';
import { Button, ButtonGroup, Card, Icon, Modal, Spinner } from '@ui-kitten/components';
//MAYBE NOT LOAD ALL MAP MARKERS AT ONCE ONLY IN REGION AND ON REGION CHANGE
const Discover = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([{ title: "Clean Up", description: "Clean up the ocean...", latlng: { latitude: 22.303033348190983, longitude: 114.1749958089978 } }])
  const [curLoc, setCurLoc] = useState(null)
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>{location ?
        <MapView initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421
        }} style={styles.map} >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
              onPress={() => { setCurLoc(marker); }}

            >
              <Image
                source={require('../images/bounty.png')}
                style={{ width: 26, height: 28 }}
                resizeMode="contain"
              /><View>
              </View>
              <Callout tooltip={true} />
            </Marker>
          ))}
        </MapView> : errorMsg ? <><Image source={require('../images/location.png')} style={{ width: 125, height: 125 }} resizeMode='contain' /><Text style={{ fontSize: 30 }}>OOPS!</Text><Text style={{ fontSize: 15 }}>Please turn on location services!</Text></> : <Spinner />
      }
      {curLoc &&
        <Modal visible={curLoc} style={{ width: '100%', position: 'absolute', top: Dimensions.get("window").height - 230 }} >
          <Card disabled={true} style={{ height: 230 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: "#cdcdcd" }}>Volunteer Event</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}><Text style={{ textDecorationLine: 'underline', textDecorationColor: "red", fontSize: 30 }}>{curLoc.title}</Text><View style={{ borderRadius: 5, backgroundColor: "#9F3737", marginHorizontal: 5 }}><Text style={{ color: "white", padding: 3 }}>Group</Text></View></View>
                <Text style={{ marginVertical: 5 }}>$3000 Bounty Credits</Text></View>
              <Button onPress={() => setCurLoc(null)} status="control" accessoryLeft={props => <Icon name="close-outline" style={{ width: 20, height: 20 }} {...props} />}></Button>

            </View>
            <Text style={{ color: "grey" }}>asdf jlaskdj fklaj slkdfjlk ajsdlkfj klasjd flkjaslkdj flkjasdkl fklasj dklfjalk sdjlkf jlaksdj flkjasdkl fjajsdlkf jalksdjf lkjasdklf jalksjf kl asjdfl k.</Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems:'center',marginTop: 20 }}><Text>Started By: mrmuke</Text><ButtonGroup ><Button accessoryLeft={(props) => <Icon {...props} name="chevron-left-outline" />}></Button><Button accessoryLeft={(props) => <Icon {...props} name="chevron-right-outline" />}></Button></ButtonGroup></View>
          </Card>
        </Modal>}
    </View>
  )
}
const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
export default Discover;