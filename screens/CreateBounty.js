import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Keyboard, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, ButtonGroup, Datepicker, Icon, Input, Text, Toggle, Divider, Radio, Modal } from '@ui-kitten/components';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import API_URL from '../api/API_URL';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {Picker} from '@react-native-picker/picker';

const Tab = createBottomTabNavigator();

const BountyPage = () => {
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
    return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:"white"}}>
      <Icon
          style={{width:100,height:100}}
          fill='green'
          name='checkmark-circle-outline'
        /><Text style={{marginVertical:20,fontSize:20}}>Bounty Created!</Text><Button onPress={()=>navigation.jumpTo('Discover', { id:created  })
      }>Check it Out</Button>
    </View>)
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

const WantePage = ({route}) => {
  const [title,setTitle]=useState("")
  const [amount,setAmount]=useState("0")
  const [date, setDate] = React.useState(new Date());
  const [who, setWho]=useState("")
  const [what, setWhat]=useState("")
  const [where, setWhere]=useState("")
  const [why, setWhy]=useState("")
  const [image, setImage] = useState(require("../images/logo.png"));

  const starIcon = (props) =>{
    return(<Icon {...props} name="image-outline"/>)
  }

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true
    });

    if(!result.cancelled){
      setImage({uri: 'data:image/jpeg;base64,' + result.base64});
    }
  };
  
  async function getDonations(){
    let token = await AsyncStorage.getItem("token");
    console.log(token)
    fetch(`${API_URL.api}/api/wante/create`, {
      method: 'POST',
      headers: {
        Authorization: "Token " + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name":title,
        "bounty":parseInt(amount),
        "who":who,
        "what":what,
        "where":where,
        "why":why,
        "date":date.toISOString().substring(0,10),
        "image": image.uri
      }),
    })
  }

  return (
  <ScrollView
    style={{
      padding:20,
      backgroundColor:"white"
    }}>
    {/* amount description title location type user whether group direcitons in steps? optional image */}
    <View style={{flexDirection:'row',alignItems:'center', paddingTop:120, marginBottom: 10}}>
      {
        //image
      }
      <View style={{flex:1}}>
        <Image style={{width:"90%",height:undefined,aspectRatio:1}} resizeMode="contain" source={image}/>
      </View>
      {
        //title, bounty, image picker
      }
      <View style={{flex:1,marginRight:10}}>
        <Input
          style={styles.input}
          textStyle={styles.inputText}
          size='large'
        placeholder='Enter Wante title..'
        value={title}
        /* caption="Get people interested in the bounty" */
        label='Wante Title'
        onChangeText={nextValue => setTitle(nextValue)}
      />
      <Input
        placeholder='Enter bounty amount..'
        style={styles.input}
        size={'large'}
        value={amount}
        /* caption="How much are you willing to give up?" */
        label='Wante Amount'
        accessoryRight={(props)=><Icon name="gift-outline" {...props}/>}
        onChangeText={nextValue => setAmount(nextValue.replace(/[^0-9]/g, ''))}
      />
      <Button appearance="outline" accessoryLeft={starIcon} style={{marginTop: 10}} onPress={
        ()=>{
          pickImage();
        }
      }>Pick Image</Button>
    </View>
  </View>

  {
    //who what why when were inputs
  }
  <Input
    placeholder='Enter description'
    style={styles.input}
    multiline={true}
    value={who}
    textStyle={{minHeight:32}}
    caption="Who are we? What are our values? etc."
    label='Who?'
    /* accessoryRight={(props)=><Icon name="eye" {...props}/>} */
    onChangeText={nextValue => setWho(nextValue)}
    onSubmitEditing={Keyboard.dismiss}
  />
  <Input
    placeholder='Enter description'
    style={styles.input}
    multiline={true}
    value={what}
    textStyle={{minHeight:64}}
    caption="What is the purpose? How can you help?"
    label='What?'
    /* accessoryRight={(props)=><Icon name="eye" {...props}/>} */
    onChangeText={nextValue => setWhat(nextValue)}
    onSubmitEditing={Keyboard.dismiss}
  />
  <Datepicker
      label='When?'
      caption='Your Wante will expire at this date..'
      placeholder='Pick Date'
      date={date}
      style={{width:'100%',...styles.input}}
      onSelect={nextDate => setDate(nextDate)}
      accessoryRight={(props)=><Icon name="calendar-outline" {...props}/>}
    />
  <Input
    placeholder='Enter description'
    style={styles.input}
    multiline={true}
    value={where}
    textStyle={{minHeight:32}}
    caption="Where will this take place?"
    label='Where?'
    /* accessoryRight={(props)=><Icon name="eye" {...props}/>} */
    onChangeText={nextValue => setWhere(nextValue)}
    onSubmitEditing={Keyboard.dismiss}
  />
  <Input
    placeholder='Enter description'
    style={styles.input}
    multiline={true}
    value={why}
    textStyle={{minHeight:64}}
    caption="Why is this important?"
    label='Why?'
    /* accessoryRight={(props)=><Icon name="eye" {...props}/>} */
    onChangeText={nextValue => setWhy(nextValue)}
    onSubmitEditing={Keyboard.dismiss}
  />

  {
    //SUBMIT BUTTON
  }
  <Button style={{width:'100%', marginTop: 10, marginBottom: 175}} onPress={()=>{
    getDonations();
  }}/* accessoryRight={StarIcon} */>
    GET DONATIONS NOW!
  </Button>

  </ScrollView>
)
}


function CreateBounty({navigation}){

  function openWante(id){
    navigation.navigate('Wante', {
      wanteId: id
    })
  }

  return(
  <Tab.Navigator tabBarOptions={{ showLabel: false, style:{ borderTopWidth: 0,position: 'absolute', top: 0, left: 0, right: 0, elevation: 0, backgroundColor: 'white', height: 120, paddingTop:30, paddingLeft:45, paddingRight:45, ...styles.shadow }}}>
    <Tab.Screen name="Bounty" component={BountyPage} options={{ tabBarIcon: ({ focused }) => (<View style={{alignItems:'center',justifyContent:'center',top:10}}><Image source={require("../images/home.png")} resizeMode='contain' style={{width:25,height:25,tintColor:focused?"#e32f45":"#748c94"}}></Image><View></View><Text style={{color:focused?"#e32f45":'#748c94',fontSize:12}}>Bounty</Text></View>) }} />
    <Tab.Screen name="Wante" component={WantePage} initialParams={{ openWante }} options={{ tabBarIcon: ({ focused }) => (<View style={{alignItems:'center',justifyContent:'center',top:10}}><Image source={require("../images/home.png")} resizeMode='contain' style={{width:25,height:25,tintColor:focused?"#e32f45":"#748c94"}}></Image><View></View><Text style={{color:focused?"#e32f45":'#748c94',fontSize:12}}>Wante</Text></View>) }} />
  </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
    input:{
        marginBottom:15,
    },
    shadow: {
      shadowColor: "#7F5DF0",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5
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