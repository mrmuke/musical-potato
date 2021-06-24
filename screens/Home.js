import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Image, ScrollView, Easing } from 'react-native';
import API_URL from '../api/API_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Modal, Card, Icon, Layout, Text, Button } from '@ui-kitten/components';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { Transition } from 'react-native-reanimated';

const Stack = createStackNavigator();

const backIcon = (props) => (
  <Icon {...props} style={[props.style, { width: 50, height: 50 }]} fill="black" name='arrow-ios-back-outline'/>
);

const forwardIcon = (props) => (
  <Icon {...props} style={[props.style, { width: 50, height: 50 }]} fill="black" name='arrow-ios-forward-outline'/>
);

const userIcon = () => (
  <Icon style={{ width: 25, height: 25, top:5, marginRight:10 }} fill="black" name='person-outline'/>
);

function days_between(date1, date2) {

  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1 - date2);

  // Convert back to days and return
  let day = Math.round(differenceMs / ONE_DAY);
  if(day >= 31){
    return Math.round(day/30);
  }
  if(day != 0){
    return day + " days";
  }
  return "Today"

}

export default Home = ({route}) => {
  const[data, setData] = useState([])
  const[selected, setSelected] = useState(0);
  const[visible,setVisible] = useState(false);

  async function getAllPosts(amount){
    let token = await AsyncStorage.getItem("token")
		let res = await fetch(`${API_URL.api}/api/wante/getAllPosts`,{
			method: "POST",
			headers: {
				Authorization: "Token " + token,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body:JSON.stringify({
				"pages": amount
			})
		});
    setData((await res.json())["data"]);
  }

  useEffect(()=>{
    getAllPosts(10);
  }, [])

  const Header = (props) => (
    <View {...props} style={[props.style, styles.header]}>
      <Avatar source={{ uri: 'https://javascriptpros.com/wp-content/themes/fmbm_base/img/jsp/apple-touch-icon.png' }} style={styles.avatar} />
      <View>
        <Text category='h6'>{props.title}</Text>
        <Text category='s1'>{props.user}</Text>
      </View>
    </View>
  );
  
  const Footer = (props) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Text category='s2' style={styles.timeAgo}>
        Ends in: {days_between(Date.parse(props.date), Date.now())}
      </Text>
    </View>
  );
  
function ModalHome({navigation}){
  if(visible == false){
    navigation.navigate("1");
  }
  return(
    <View style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, left:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("5")} accessoryLeft={backIcon}></Button>
      </View>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, right:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("2")} accessoryLeft={forwardIcon}></Button>
      </View>
      <Text category="h3" style={{width:"100%", textAlign:"center"}}>{data[selected].name}</Text>
      <Text category="s1" style={{marginRight:"43%"}}>{userIcon()}{data[selected].user}</Text>
      <Image source={{uri:`${API_URL.api}${data[selected].image}`}} style={{width:"60%", height:undefined, aspectRatio:1, marginTop:20, borderRadius: 10}}/>
      <View style={{display:"flex", flexDirection:"row", marginTop: 20}}>
        <View style={{width:8, height:8, backgroundColor:"#141518", borderRadius:25, marginRight: 10}}></View>
        <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
        <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
        <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
        <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25}}></View>
      </View>
      <Button style={{width:"60%", marginTop: 20, borderRadius: 10}}>Donate Now!</Button>
    </View>
  )
}

function ModalWhat({navigation}){
  if(visible == false){
    navigation.navigate("1");
  }
  return(
    <View style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, left:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("2")} accessoryLeft={backIcon}></Button>
      </View>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, right:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("4")} accessoryLeft={forwardIcon}></Button>
      </View>
      <Text category="h3" style={{width:"100%", textAlign:"center"}}>What is it for?</Text>
      <Text category="s1" style={{marginTop: 10, width:"100%", textAlign:"center"}}>{data[selected].what}</Text>
      <View style={{position:"absolute", width:"100%", bottom: 40, display:"flex", justifyContent:"center", alignItems:"center"}}>
        <View style={{display:"flex", flexDirection:"row", marginTop: 20}}>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#141518", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25}}></View>
        </View>
        <Button style={{width:"60%", marginTop: 20, borderRadius: 10}}>Donate Now!</Button>
      </View>
    </View>
  )
}

function ModalWho({navigation}){
  if(visible == false){
    navigation.navigate("1");
  }
  return(
    <View style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, left:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("1")} accessoryLeft={backIcon}></Button>
      </View>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, right:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("3")} accessoryLeft={forwardIcon}></Button>
      </View>
      <Text category="h3" style={{width:"100%", textAlign:"center"}}>Who are we?</Text>
      <Text category="s1" style={{marginTop: 10, width:"100%", textAlign:"center"}}>{data[selected].who}</Text>
      <View style={{position:"absolute", width:"100%", bottom: 40, display:"flex", justifyContent:"center", alignItems:"center"}}>
        <View style={{display:"flex", flexDirection:"row", marginTop: 20}}>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#141518", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25}}></View>
        </View>
        <Button style={{width:"60%", marginTop: 20, borderRadius: 10}}>Donate Now!</Button>
      </View>
    </View>
  )
}

function ModalWhy({navigation}){
  if(visible == false){
    navigation.navigate("1");
  }
  return(
    <View style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, left:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("3")} accessoryLeft={backIcon}></Button>
      </View>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, right:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("5")} accessoryLeft={forwardIcon}></Button>
      </View>
      <Text category="h3" style={{width:"100%", textAlign:"center"}}>Why do this?</Text>
      <Text category="s1" style={{marginTop: 10, width:"100%", textAlign:"center"}}>{data[selected].why}</Text>
      <View style={{position:"absolute", width:"100%", bottom: 40, display:"flex", justifyContent:"center", alignItems:"center"}}>
        <View style={{display:"flex", flexDirection:"row", marginTop: 20}}>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#141518", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25}}></View>
        </View>
        <Button style={{width:"60%", marginTop: 20, borderRadius: 10}}>Donate Now!</Button>
      </View>
    </View>
  )
}

function ModalWhenWhere({navigation}){
  if(visible == false){
    navigation.navigate("1");
  }
  return(
    <View style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, left:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("4")} accessoryLeft={backIcon}></Button>
      </View>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, right:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("1")} accessoryLeft={forwardIcon}></Button>
      </View>
      <Text category="h3" style={{width:"100%", textAlign:"center"}}>Where is it?</Text>
      <Text category="s1" style={{marginTop: 10, width:"100%", textAlign:"center"}}>{data[selected].where}</Text>
      <View style={{position:"absolute", width:"100%", bottom: 40, display:"flex", justifyContent:"center", alignItems:"center"}}>
        <View style={{display:"flex", flexDirection:"row", marginTop: 20}}>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#141518", borderRadius:25}}></View>
        </View>
        <Button style={{width:"60%", marginTop: 20, borderRadius: 10}}>Donate Now!</Button>
      </View>
    </View>
  )
}

  return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: "white"
    }}>

    <Layout style={styles.container}>
      {
        (function(){
          let arr = []
          let index = 0;
          for(let obj of data){
            let stay = index;
            arr.push(<Card key={index} style={styles.card} header={(props) => <Header {...props} title={obj.name} user={obj.user} />} footer={(props) => <Footer {...props} date={obj.date}/>} onPress={()=>{setVisible(true); setSelected(stay)}}>
              <Image source={{ uri: `${API_URL.api}${obj.image}`}} style={styles.image} />
              <Text>
              {obj.what}
              </Text>
            </Card>)
            index++;
          }
          return arr;
        })()
      }
      {
        (function(){
          if(data != []){
            return(
              <Modal visible={visible}
               backdropStyle={styles.backdrop}
               style={{width:"90%", height:"55%"}}
               onBackdropPress={() => setVisible(false)}>
                 <View style={{width:"100%", height:"100%", borderRadius:5, overflow:'hidden'}}>
                  <NavigationContainer>
                    <Stack.Navigator screenOptions={{headerShown:false}}>
                        <Stack.Screen name="1" component={ModalHome}/>
                        <Stack.Screen name="2" component={ModalWho}/>
                        <Stack.Screen name="3" component={ModalWhat}/>
                        <Stack.Screen name="4" component={ModalWhy}/>
                        <Stack.Screen name="5" component={ModalWhenWhere}/>
                      </Stack.Navigator>
                  </NavigationContainer>
                 </View>
              </Modal>
            )
          }
        })()
      }
    </Layout>
  </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginTop: 40,
    marginBottom: 135
  },
  card: {
    margin: 20,
    borderRadius: 10,
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 5
  },
  header: {
    flexDirection: 'row'
  },
  avatar: {
    marginRight: 24,
  },
  image: {
    height:300,
    marginBottom: 16
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 5,
  },
  timeAgo: {
    marginLeft: 'auto',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width:"100%"
  },
});
