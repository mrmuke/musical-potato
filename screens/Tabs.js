
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './Home'
import Discover from './Discover'
import CreateBounty from './CreateBounty'
import Settings from './Settings'
import Shop from './Shop'
import { Image, StyleSheet, TouchableOpacity, View,Text } from 'react-native'
import React from 'react'

const Tab = createBottomTabNavigator()
const CustomTabBarButton = ({children,onPress})=>(
  <TouchableOpacity style={{top:-30,justifyContent:'center',alignItems:'center',...styles.shadow}} onPress={onPress}>
    <View style={{width:70,height:70,borderRadius:35,backgroundColor:"#e32f45"}}>
      {children}
    </View>
  </TouchableOpacity>
)

function Tabs({navigation}) {

  return (<Tab.Navigator tabBarOptions={{ showLabel: false, style: { position: 'absolute', bottom: 25, left: 20, right: 20, elevation: 0, backgroundColor: 'white', borderRadius: 15, height: 90, ...styles.shadow }}}>
    <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: ({ focused }) => (<View style={{alignItems:'center',justifyContent:'center',top:10}}><Image source={require("../images/home.png")} resizeMode='contain' style={{width:25,height:25,tintColor:focused?"#e32f45":"#748c94"}}></Image><View></View><Text style={{color:focused?"#e32f45":'#748c94',fontSize:12}}>Home</Text></View>) }} />
    <Tab.Screen name="Discover" component={Discover} options={{tabBarIcon: ({ focused }) => (<View style={{alignItems:'center',justifyContent:'center',top:10}}><Image source={require("../images/search.png")} resizeMode='contain' style={{width:25,height:25,tintColor:focused?"#e32f45":"#748c94"}}></Image><Text style={{color:focused?"#e32f45":'#748c94',fontSize:12}}>Find</Text></View>) }}/>
    <Tab.Screen name="Create" component={CreateBounty} options={{headerShown: false, tabBarIcon:({focused})=>(
      <Image source={require('../images/plus.png')} resizeMode="contain" style={{width:30,height:30,tintColor:"#fff"}}/>
    ),tabBarButton:(props)=>(
      <CustomTabBarButton {...props}/>
    )}}/>
    <Tab.Screen name="Settings" component={Settings} options={{ tabBarIcon: ({ focused }) => (<View style={{alignItems:'center',justifyContent:'center',top:10}}><Image source={require("../images/settings.png")} resizeMode='contain' style={{width:25,height:25,tintColor:focused?"#e32f45":"#748c94"}}></Image><Text style={{color:focused?"#e32f45":'#748c94',fontSize:12}}>Settings</Text></View>) }}/>
    <Tab.Screen name="Shop" component={Shop} options={{ tabBarIcon: ({ focused }) => (<View style={{alignItems:'center',justifyContent:'center',top:10}}><Image source={require("../images/shop.png")} resizeMode='contain' style={{width:25,height:25,tintColor:focused?"#e32f45":"#748c94"}}></Image><Text style={{color:focused?"#e32f45":'#748c94',fontSize:12}}>Shop</Text></View>) }}/>
  </Tab.Navigator>)
}
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
})
export default Tabs