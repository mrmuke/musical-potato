// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
import 'react-native-gesture-handler';
import { ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

// Import React and Component
import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location';
import API_URL from './api/API_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Navigators from React Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Import Screens
import SplashScreen from './screens/Splash';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import Tabs from './screens/Tabs';
import { default as theme } from './custom-theme.json'; // <-- Import app theme
import ActiveBounty from './screens/ActiveBounty';

const Stack = createStackNavigator();

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: 'Register', //Set Header Title
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  
  const [activeBounty, setActiveBounty] = useState(null);

  useEffect(() => {
    getActiveBounty()
  }, [])
  async function getActiveBounty() {
    fetch(`${API_URL.api}/api/bounty/getActive`, {
      headers: {
        "Authorization": "Token " + await AsyncStorage.getItem('token')
      },
      credentials: "same-origin"
    }).then(result => result.json()).then(result => {
      if (!result.hasOwnProperty('msg')) {
        setActiveBounty(result);
      }
    })
  }


  return ( <><IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{headerShown: false}}
        />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          initialParams={{activeBounty}}
          // Hiding header for Navigation Drawer
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Active Bounty"
          component={ActiveBounty}
          options={{headerShown:false}}
        />
      </Stack.Navigator>
    </NavigationContainer></ApplicationProvider>
  </>);
};

export default App;