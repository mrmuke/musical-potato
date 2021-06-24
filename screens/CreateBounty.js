import React, { useState } from 'react';
import { Image, Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, ButtonGroup, Datepicker, Divider, Icon, Input, Modal, Radio, Text, Toggle } from '@ui-kitten/components';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import API_URL from '../api/API_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

const CreateBounty = ({navigation}) => {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("0")
  const [date, setDate] = React.useState(new Date());

  const [description, setDescription] = useState("")
  const [showGroupOption, setShowGroupOption] = useState(false)
  const [numPeople, setNumPeople] = useState("1")
  const [type, setType] = useState("Volunteer")
  const [customLoc, setCustomLoc] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedLoc, setSelectedLoc] = useState(null)
  const [created,setCreated]=useState(null)

  const [hours,setHours]=useState(1)
  {/* amount description title location type user whether group direcitons in steps? optional image 
      
      auto location and change if want*/}
  async function create() {
    console.log(await AsyncStorage.getItem("token"))

    var data = { title: title, amount: parseInt(amount), expiry: date.toISOString().slice(0, 10), description: description, numPeople: parseInt(numPeople), type: type, duration:hours }
    if (!customLoc) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert("Please turn on location services or input a custom location..")
        return
      }

      let location = await Location.getCurrentPositionAsync({});
      data["lng"] = location.coords.longitude
      data["lat"] = location.coords.latitude
    }
    else {
      let coords =await(await fetch(`https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyCIZSerzQxoOpwyamViMkGZFMCdklqLqfk&place_id=${selectedLoc.place_id}`)).json()
        data["lat"] = coords.result.geometry.location.lat
        data["lng"] = coords.result.geometry.location.lng
      

    }
    fetch(`${API_URL.api}/api/bounty/create`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"



    }).then(response=>response.json()).then(response=>{
      console.log(response)
      setCreated(response.id)
    })

  }
  if(created){
    return (<View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:"white"}}>
<Icon
    style={{width:100,height:100}}
    fill='green'
    name='checkmark-circle-outline'
  /><Text style={{marginVertical:20,fontSize:20}}>Bounty Created!</Text><Button onPress={()=>navigation.jumpTo('Discover', { id:created  })
}>Check it Out</Button></View>)
  }
  return (<>
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: "white",
        height: 850
      }}>
      <View><Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 30, paddingBottom: 20 }}>Create Bounty</Text></View><Divider style={{ marginBottom: 10 }} />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>

        <View style={{ flex: 1, marginRight: 10 }}>
          <Input
            style={styles.input}
            textStyle={styles.inputText}
            size='large'
            placeholder='Enter bounty title..'
            value={title}
            /* caption="Get people interested in the bounty" */
            label='Bounty Title'
            onChangeText={nextValue => setTitle(nextValue)}
          />
          <Input
            placeholder='Enter bounty amount..'
            style={styles.input}
            size={'large'}
            value={amount}
            /* caption="How much are you willing to give up?" */
            label='Bounty Amount'
            accessoryRight={(props) => <Icon name="gift-outline" {...props} />}
            onChangeText={nextValue => setAmount(nextValue.replace(/[^0-9]/g, ''))}
          /></View>
        <View style={{ flex: 1 }}>
          <Image style={{ width: "100%", height: undefined, aspectRatio: 1 }} resizeMode="contain" source={require("../images/logo.png")} /></View>
      </View>
      <Input
        placeholder='Enter bounty description..'
        style={styles.input}
        multiline={true}
        value={description}
        textStyle={{ minHeight: 64 }}
        caption="Give some instructions.."
        label='Bounty Description'
        /* accessoryRight={(props)=><Icon name="eye" {...props}/>} */
        onChangeText={nextValue => setDescription(nextValue)}
        onSubmitEditing={Keyboard.dismiss}
      />
      <Datepicker
        label='Expiry Date'
        caption='Your bounty will expire at this date..'
        placeholder='Pick Date'
        date={date}
        style={{ width: '100%', ...styles.input }}
        onSelect={nextDate => setDate(nextDate)}
        accessoryRight={(props) => <Icon name="calendar-outline" {...props} />}
      />
      
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Radio
          style={{ marginVertical: 5, marginBottom: 18 }}
          checked={customLoc}
          onChange={() => { if (!customLoc && !selectedLoc) { setShowModal(true) }; if (customLoc) { setSelectedLoc(false) } setCustomLoc(!customLoc); }}>
          Custom Location
    </Radio>{selectedLoc && <TouchableOpacity style={{ borderRadius: 15, padding: 8, backgroundColor: "#eee" }} onPress={() => setShowModal(true)}><Text>{selectedLoc.description.substr(0, 10)}..</Text></TouchableOpacity>}
      </View>
      <ButtonGroup status="primary" style={styles.input } appearance='filled'>
        <Button style={{ backgroundColor: type == "Volunteer" ? "#CA3434" : "#E84C3D" }} onPress={() => setType("Volunteer")}>Volunteer</Button>
        <Button style={{ backgroundColor: type == "Cleaning" ? "#CA3434" : "#E84C3D" }} onPress={() => setType("Cleaning")}>Cleaning</Button>
        <Button style={{ backgroundColor: type == "Movement" ? "#CA3434" : "#E84C3D" }} onPress={() => setType("Movement")}>Movement</Button>
      </ButtonGroup>
      <View style={{ height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', ...styles.input }}>
      <Picker
  selectedValue={hours}
  style={styles.onePicker} itemStyle={styles.onePickerItem}
  onValueChange={(itemValue) =>
    setHours(itemValue)
  }>
  <Picker.Item label="1 hour" value={1} />
  {Array.from({length:9},(v,k)=>k+2).map(number=>(
    <Picker.Item key={number} label={number+" hours"} value={number} />
  ))
}
  
</Picker>
        <Toggle checked={showGroupOption} style={{ marginRight: 10 }} onChange={() => setShowGroupOption(!showGroupOption)}>
          {!showGroupOption && "Group"}
        </Toggle>{showGroupOption && <Input
          placeholder='# ppl'
          value={numPeople}
          size="large"
          accessoryRight={(props) => <Icon name="people-outline" {...props} />}
          onChangeText={nextValue => setNumPeople(nextValue)}
          onSubmitEditing={Keyboard.dismiss}
        />}
        
        </View>
        



      <Button onPress={create} style={{ width: '100%' }} /* accessoryRight={StarIcon} */>
        HELP WANTED!
    </Button>


    </ScrollView><Modal onBackdropPress={() => { setShowModal(false); if (!selectedLoc) { setCustomLoc(false) } }} backdropStyle={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }} style={{ width: "80%", position: 'absolute', top: 50 }} visible={showModal}>
      <GooglePlacesAutocomplete
        placeholder='Search'
        onPress={(data, details = null) => {
          console.log(data)
          // 'details' is provided when fetchDetails = true
          setShowModal(false)
          setSelectedLoc(data)
        }}
        query={{
          key: 'AIzaSyCIZSerzQxoOpwyamViMkGZFMCdklqLqfk',
          language: 'en',
        }}
      /></Modal></>
  )
}
const styles = StyleSheet.create({
  input: {

    marginBottom: 15,
  },
  onePicker: {
    width: 170,
    height: 44
  },
  onePickerItem: {
    height: 44,
  },
})

export default CreateBounty;