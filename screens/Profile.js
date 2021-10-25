import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import API_URL from '../api/API_URL';
import { Divider, Toggle, Text, Input, Button } from '@ui-kitten/components';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const Profile = () => {
    const [userData, setUserData] = useState({
        "username":"loading...",
        "email":"loading...",
        "profile":{
            "balance":"loading...",
            "bio":"loading..."
        },
    });
    const [userBio, setUserBio] = useState("");
    
    async function getUserData(){
        let token = await AsyncStorage.getItem("token");
        let res = await fetch(`${API_URL.api}/api/users/user`, {
            method: "GET",
			headers: {
				Authorization: "Token " + token,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
        });
        let data = await res.json();
        setUserData(data);
        setUserBio(data.profile.bio);
    }

    useEffect(()=>{
        getUserData();
    }, []);

    return (
        <View
        style={{
            flex: 1,
            backgroundColor: 'white', paddingTop: 20
        }}>
            {/* Title */}
            <View><Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 30, paddingBottom: 20 }}>Profile</Text></View><Divider />

            <ScrollView style={{marginTop: 0}}>
                <View style={{display:"flex", alignItems:"center", marginTop: 20}}>
                    <Image source={require("./../images/user.png")} style={{borderRadius:1000, width: width/2, height: width/2}}/>
                    {/* username */}
                    <View style={{alignItems:"center", flexDirection:"row", height:width*0.1, marginTop: 10, paddingLeft: width*0.07 + 10}}>
                        <Text style={{fontSize: width * 0.08, fontWeight:"bold"}}>
                            {userData.username}
                        </Text>
                        <TouchableOpacity style={{marginLeft:10}}><Icon name="pencil-outline" style={{fontSize:width*0.07, color:"#E84C3D"}}/></TouchableOpacity>
                    </View>
                    {/* email */}
                    <Text style={{fontSize: width * 0.04,}}>{userData.email}</Text>

                    {/* balance, trees, donated, bounties */}
                    <View style={{width: width, padding: 20, flexDirection:"row"}}>
                        <View style={{width:(width-40)/4, justifyContent:"center", alignItems:"center"}}>
                            <Text style={{fontSize: width * 0.05, fontWeight:"bold", color:"#E84C3D"}}>{userData.profile.balance}</Text>
                            <Text style={{fontSize: width * 0.03}}>Balance</Text>
                        </View>
                        <View style={{width:(width-40)/4, justifyContent:"center", alignItems:"center"}}>
                            <Text style={{fontSize: width * 0.05, fontWeight:"bold", color:"#006600"}}>3</Text>
                            <Text style={{fontSize: width * 0.03}}>Trees</Text>
                        </View>
                        <View style={{width:(width-40)/4, justifyContent:"center", alignItems:"center"}}>
                            <Text style={{fontSize: width * 0.05, fontWeight:"bold", color:"#e6b800"}}>67</Text>
                            <Text style={{fontSize: width * 0.03}}>Bounties</Text>
                        </View>
                        <View style={{width:(width-40)/4, justifyContent:"center", alignItems:"center"}}>
                            <Text style={{fontSize: width * 0.05, fontWeight:"bold", color:"#000099"}}>3920</Text>
                            <Text style={{fontSize: width * 0.03}}>Donations</Text>
                        </View>
                    </View>

                    <View style={{width: width, backgroundColor:"#E84C3D", alignItems:"center", paddingBottom: 200}}>
                        <View style={{width: width, height:height*0.03, backgroundColor:"white", borderBottomLeftRadius:100,borderBottomRightRadius:100, marginBottom: 20}}></View>
                        <Input
                            size='large'
                            placeholder='Add to your bio...'
                            style={{width: width*0.9, backgroundColor:"white", borderRadius:15}}
                            value={userBio}
                            onChangeText={text=>setUserBio(text)}
                        />
                        {
                            (()=>{
                                if(userBio != userData.profile.bio){
                                    return(<Button style={{width: width * 0.9, borderColor:"white", borderRadius:15, marginTop: 10}}>Save!</Button>);
                                }
                            })()
                        }
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}


const styles = StyleSheet.create({

  setting: {
    padding: 16,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Profile;

