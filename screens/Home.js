/* import { Button, Card,Divider,Text } from '@ui-kitten/components';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
const Header = (props) => (
    <View {...props}>
      <Text category='h6'>Maldives</Text>
      <Text category='s1'>By Wikipedia</Text>
    </View>
  );
  
  const Footer = (props) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Button
        style={styles.footerControl}
        size='small'
        status='basic'>
        CANCEL
      </Button>
      <Button
        style={styles.footerControl}
        size='small'>
        Donate
      </Button>
    </View>
  );
const Home = () => {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor:"white"
      }}>
          <View style={{padding:20}}><Text  style={{textAlign:'center',fontWeight:"700",fontSize:30}}>Issues</Text></View>
      <Card style={styles.card} header={Header} footer={Footer}>
      <Text>
        The Maldives, officially the Republic of Maldives, is a small country in South Asia, located in the Arabian Sea
        of the Indian Ocean. It lies southwest of Sri Lanka and India, about 1,000 kilometres (620 mi) from the Asian
        continent
      </Text>
    </Card>
    <Card style={styles.card} header={Header} footer={Footer}>
      <Text>
        The Maldives, officially the Republic of Maldives, is a small country in South Asia, located in the Arabian Sea
        of the Indian Ocean. It lies southwest of Sri Lanka and India, about 1,000 kilometres (620 mi) from the Asian
        continent
      </Text>
    </Card>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    card: {
      margin: 2,
    },
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    footerControl: {
      marginHorizontal: 2,
    },
  });
export default Home; */


import React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { Avatar, Button, Card, Divider, Icon, Layout, Text } from '@ui-kitten/components';

const Header = (props) => (
  <View {...props} style={[props.style, styles.header]}>
    <Avatar source={{ uri: 'https://javascriptpros.com/wp-content/themes/fmbm_base/img/jsp/apple-touch-icon.png' }} style={styles.avatar} />
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

export default CardAccessoriesShowcase = () => (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: "white"
    }}>
    <View style={{ padding: 20 }}><Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 30 }}>Issues</Text></View><Divider style={{ marginBottom: 10 }} />

    <Layout style={styles.container}>
      <Card style={styles.card} header={Header} footer={Footer}>
        <Image source={{ uri: 'https://javascriptpros.com/wp-content/uploads/2020/07/react-native-workshop-1024x538-2.jpg' }} style={styles.image} />
        <Text>
          {"I'm baby echo park franzen beard tumblr pabst chambray organic. Mlkshk flexitarian master cleanse pork belly pop-up. Venmo ugh meggings cornhole, fingerstache heirloom gentrify kogi."}
        </Text>
      </Card>
    </Layout>
  </ScrollView>
);

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
