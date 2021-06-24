import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import API_URL from '../api/API_URL';
import { Divider, Toggle, Text } from '@ui-kitten/components';
const Settings = ({ navigation }) => {
  function signOut() {
    fetch(`${API_URL.api}/api/users/logout`, { method: 'POST', headers: { "Authorization": "Token " + AsyncStorage.getItem('token') }, credentials: "same-origin" })
      .then(() => {
        AsyncStorage.removeItem('token')
        navigation.replace('Auth');
      })
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white', paddingTop: 20
      }}>
      <View><Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 30, paddingBottom: 20 }}>Settings</Text></View><Divider style={{ marginBottom: 10 }} />

      <Setting
        style={styles.setting}
        hint='Edit Profile'
      />
      <Setting
        style={styles.setting}
        hint='Change Password'
      />
      <Setting
        style={styles.setting}
        hint='Notifications'
      />
      <Setting
        style={styles.setting}
        hint='Privacy'
      />
      <Setting
        style={styles.setting}
        hint='Sound Enabled'
      >
        <Toggle

        />
      </Setting>
      <Setting
        style={styles.setting}
        hint='Sign Out'
        onPress={signOut}
      />
    </View>
  )
}

const Setting = (props) => {

  const { style, hint, children, onPress } = props;

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, style]}>
        <Text
          category='s2'>
          {hint}
        </Text>
        {children}
      </TouchableOpacity>
      <Divider />
    </React.Fragment>
  );
};


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
export default Settings;

