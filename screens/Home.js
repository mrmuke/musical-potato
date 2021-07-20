


import React,{useState,useEffect} from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { Modal,Avatar, Button, Card, Divider,List,ListItem, Icon, Layout, Text } from '@ui-kitten/components';
import Header from '../components/Header'
import API_URL from '../api/API_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CardHeader = (props) => (
  <View {...props} style={[props.style, styles.header]}>
    <Avatar source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png' }} style={styles.avatar} />
    <View>
      <Text category='h6'>React Native</Text>
      <Text category='s1'>JavaScript Pros</Text>
    </View>
  </View>
);

const Footer = (props) => (
  <View {...props} style={[props.style, styles.footerContainer]}>
    <Button accessoryLeft={props => <Icon
      style={styles.icon}
      fill='white'
      name='heart-outline' {...props}
    />}><Text style={{ color: 'white' }} category='s1'>
        Donate
  </Text></Button>


    <Text category='s2' style={styles.timeAgo}>
      11h ago
    </Text>
  </View>
);

const renderItemAccessory = (props) => (
  <View style={{flexDirection:"row"}}>
  <Button status="success" size='tiny'>View</Button>
  </View>
);

const renderItemIcon = (props) => (
  <Icon {...props} name='person'/>
);

export default function CardAccessoriesShowcase(){
  const [showSubmissionInfo,setShowSubmissionInfo]=useState(null)
  const [data,setData]=useState([])

  useEffect(()=>{
    getAwaiting()
  },[])
  async function getAwaiting(){
    fetch(`${API_URL.api}/api/bounty/getAwaiting`, {
      headers: {
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"
    }).then(result=>result.json()).then(result=>{
      console.log(result)
      setData(result)
    })
  }
  const renderItem = ({ item, index }) => (
    <ListItem
    onPress={()=>setShowSubmissionInfo(item)}
      title={"Submission #" +(index+1)}
      description={item.text}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  );
  async function acceptSubmission(){
    fetch(`${API_URL.api}/api/bounty/accept/${showSubmissionInfo.activeBounty}`, {
      method:"PUT",
      headers: {
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"
    }).then(result=>result.json()).then(result=>{
      setData(data.splice(data.findIndex(e=>e.id=showSubmissionInfo.id), 1))
      setShowSubmissionInfo(null)
    })
  }
  async function declineSubmission(){
    console.log(showSubmissionInfo)
    fetch(`${API_URL.api}/api/bounty/deny/${showSubmissionInfo.activeBounty}`, {
      method:"PUT",
      headers: {
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"
    }).then(result=>result.json()).then(result=>{
      setData(data.splice(data.findIndex(e=>e.id=showSubmissionInfo.id), 1))
      setShowSubmissionInfo(null)
    })
  }
  return (<ScrollView
    style={{
      flex: 1,
      backgroundColor: "white"
    }}>
      <Modal onBackdropPress={()=>setShowSubmissionInfo(null)} backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} visible={showSubmissionInfo}>
        {showSubmissionInfo&&<View style={{backgroundColor:"white",padding:10}}><Text style={{fontSize:25,fontWeight:"600"}}>
          Bounty Submission
        </Text>
        <Text style={{marginVertical:10}}>{showSubmissionInfo.text}</Text>
        <Image source={{uri:"https://previews.123rf.com/images/nakedking/nakedking1802/nakedking180201204/96409502-pile-of-trash-bags.jpg"}} style={{width:"100%",height:200}}/>
        <Button status="success" onPress={acceptSubmission}>Accept</Button>
        <Button onPress={declineSubmission}>Decline</Button>
        </View>}
      </Modal>
    <Header text="Issues"/>
    <List
      data={data}
      renderItem={renderItem}
    />
    <Layout style={styles.container}>
      <Card style={styles.card} header={CardHeader} footer={Footer}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80' }} style={styles.image} />
        <Text>
          {"I'm baby echo park franzen beard tumblr pabst chambray organic. Mlkshk flexitarian master cleanse pork belly pop-up. Venmo ugh meggings cornhole, fingerstache heirloom gentrify kogi."}
        </Text>
      </Card>
    </Layout>
  </ScrollView>)
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  card: {
    margin: 2,
  },
  header: {
    flexDirection: 'row'
  },
  avatar: {
    marginRight: 24,
  },
  image: {
    height: 200,
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
    marginLeft: 'auto'
  }
});
