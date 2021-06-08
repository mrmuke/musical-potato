import React, {useState, createRef} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Image } from 'react-native';
import API_URL from '../api/API_URL';
/*maybe add keyboard avoiding view*/
const RegisterScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);

  const emailInputRef = createRef();

  const passwordInputRef = createRef();
  const handleSubmitButton = () => {
    if (!username) {
      alert('Please fill in your username');
      return;
    }
    if (!email) {
      alert('Please fill in your email');
      return;
    }

    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      username: username,
      email: email,
      password: userPassword,
    };
    fetch(`${API_URL.api}/api/users/register`, {
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
          setIsRegistraionSuccess(true);
          console.log(
            'Registration Successful. Please Login to proceed'
          );

      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };
  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#9F3737',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../images/success.png')}
          style={{
            height: 150,
            resizeMode: 'contain',
            alignSelf: 'center'
          }}
        />
        <Text style={styles.successTextStyle}>
          Registration Successful
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Wanted</Text>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Username..." 
            placeholderTextColor="#003f5c"
            value={username}
            returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            onChangeText={text => setUsername(text)}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Email..." 
            placeholderTextColor="#003f5c"
            value={email}
            ref={emailInputRef}
              returnKeyType="next"
            onSubmitEditing={() =>
              passwordInputRef.current &&
              passwordInputRef.current.focus()
            }
            onChangeText={text => setEmail(text)}/>
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
        <TouchableOpacity onPress={handleSubmitButton} style={styles.loginBtn}>
          <Text  style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.loginText}>Login</Text>
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
  },
  buttonTextStyle: {
    color: '#9F3737',
    paddingVertical: 10,
    fontSize: 16,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
  buttonStyle: {
    backgroundColor: 'white',
    borderWidth: 0,
    color: '#9F3737',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
})
export default RegisterScreen