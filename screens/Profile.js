import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import API_URL from '../api/API_URL';
import { Divider, Toggle, Text, Input, Button, Modal } from '@ui-kitten/components';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { PieChart } from 'react-native-chart-kit'

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const Profile = () => {
    const [userData, setUserData] = useState({
        "username":"loading...",
        "email":"loading...",
        "profile":{
            "balance": 0,
            "bio":"loading...",
            "json":`{
                "loading": 0
            }`
        },
    });
    const [userBio, setUserBio] = useState("");
    const [visible, setVisible] = useState(false);
    const [newUsername, setNewUsername] = useState("");

    const chartConfig = {
        backgroundGradientFrom: '#1E2923',
        backgroundGradientTo: '#08130D',
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
    }

    const pieChartColor = [
        "#e2cf56",
        "#aee256",
        "#68e156",
        "#56e189",
        "#56e2cf",
        "#56aee2",
        "#5668e2",
        "#5668e2",
        "#cf56e2",
        "#e256ae",
        "#e28956",
        "#e2cf56"
    ]

    const pieData = [
        { name: 'Seoul', population: 21500000, color: pieChartColor[0], legendFontColor: 'white', legendFontSize: 15 },
        { name: 'Toronto', population: 2800000, color: pieChartColor[1], legendFontColor: 'white',legendFontSize: 15 },
        { name: 'Beijing', population: 527612, color: pieChartColor[2], legendFontColor: 'white',legendFontSize: 15 },
        { name: 'New York', population: 8538000, color: pieChartColor[3], legendFontColor: 'white', legendFontSize: 15 },
        { name: 'Moscow', population: 11920000, color: pieChartColor[4], legendFontColor: 'white', legendFontSize: 15 }
    ];
      
    
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

    async function changeUsername(){
        let token = await AsyncStorage.getItem("token");
    }

    async function changeBio(){
        let token = await AsyncStorage.getItem("token");
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
                        <TouchableOpacity style={{marginLeft:10}}><Icon name="pencil-outline" style={{fontSize:width*0.07, color:"#E84C3D"}} onPress={()=>{setVisible(true);}}/></TouchableOpacity>
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
                            <Text style={{fontSize: width * 0.05, fontWeight:"bold", color:"#000099"}}>{
                                (()=>{
                                    let data = (JSON.parse(userData.profile.json.replace(/'/g, '"') ));
                                    var total = 0;
                                    for(var i in data){
                                        total += data[i];
                                    }
                                    return total;
                                })()
                            }</Text>
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
                                    return(<Button style={{width: width * 0.9, borderColor:"white", borderRadius:15, marginTop: 10}} onPress={()=>changeBio}>Save!</Button>);
                                }
                            })()
                        }
                        <Text style={{marginTop: 30, color:"white", fontSize: width*0.05, marginBottom: 20, fontWeight:"bold"}}>Your Donation Profile</Text>
                        {
                            (()=>{
                                if(userData.profile.json == null){
                                    return;
                                }
                                let pieData = [];
                                let data = (JSON.parse(userData.profile.json.replace(/'/g, '"') ));
                                let colorCount = 0;
                                for(var i in data){
                                    pieData.push({ name: i, population: data[i], color: pieChartColor[colorCount], legendFontColor: 'white', legendFontSize: 15 });
                                    colorCount++;
                                }
                                return(<PieChart
                                    data={pieData}
                                    width={width * 0.8}
                                    height={width * 0.5}
                                    chartConfig={chartConfig}
                                    accessor="population"
                                    backgroundColor="transparent"
                                />)
                            })()
                        }
                    </View>
                </View>
            </ScrollView>
            <Modal visible={visible}
               backdropStyle={styles.backdrop}
               style={{width:"90%", height:"40%"}}
               onBackdropPress={() =>{setVisible(false); setNewUsername("")}}>
                 <View style={{width:"100%", height:"100%", borderRadius:5, overflow:'hidden', backgroundColor:"white", justifyContent:"center", alignItems:"center"}}>
                     <Text style={{fontSize:width*0.05, marginBottom: 10}}>Change Username:</Text>
                    <Input
                        size='large'
                        placeholder='Username...'
                        style={{width: "80%", backgroundColor:"white", borderRadius:15}}
                        value={newUsername}
                        onChangeText={(text)=>{
                            setNewUsername(text);
                        }}
                    />
                    <Button style={{width: "80%", borderColor:"white", borderRadius:15, marginTop: 10}} onPress={()=>changeUsername}>Save!</Button>
                 </View>
              </Modal>
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width:"100%"
  },
});

export default Profile;

