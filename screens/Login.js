import React, {useState, createRef} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../api/API_URL';
import { showMessage } from "react-native-flash-message";

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordInputRef = createRef();

  const handleSubmitPress = () => {
    if (!username) {
      alert('Please fill in your username');
      return;
    }
    if (!userPassword) {
      alert('Please fill in your password');
      return;
    }
    setLoading(true);
    let dataToSend = {username: username, password: userPassword};
    console.log(API_URL.api)
    fetch(`${API_URL.api}/api/users/login`, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        //Header Defination
        'Content-Type':
        'application/json',
      },
      
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
          AsyncStorage.setItem('token', responseJson.token);
          navigation.replace('Tabs');
        
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        let message=""
        Object.keys(error.response).forEach(function(key,index) {
          message+=key[i].charAt(0).toUpperCase() + key.substring(1)+" : "+error.response[key][0]+" "
        });
        showMessage({message:message,type:"danger"})


      });
  };
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Wanted</Text>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Username..." 
            placeholderTextColor="#003f5c"
            value={username}
            onSubmitEditing={() =>
              passwordInputRef.current &&
              passwordInputRef.current.focus()
            }
            onChangeText={text => setUsername(text)}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
          value={userPassword}
          ref={passwordInputRef}
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={false}
          secureTextEntry={true}
            style={styles.inputText}
            placeholder="Password..." 
            placeholderTextColor="#003f5c"
            onChangeText={text => setUserPassword(text)}/>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmitPress} style={styles.loginBtn}>
          <Text  style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.loginText}>Signup</Text>
        </TouchableOpacity>

  
      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
})
export default Login