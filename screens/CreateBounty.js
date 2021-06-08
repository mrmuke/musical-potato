import React, { useState } from 'react';
import { Image, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { Button, ButtonGroup, Datepicker, Divider, Icon, Input, Text, Toggle } from '@ui-kitten/components';
const CreateBounty = () => {
    const [title,setTitle]=useState("")
    const [amount,setAmount]=useState("0")
    const [date, setDate] = React.useState(new Date());

    const [description,setDescription]=useState("")
    const [showGroupOption, setShowGroupOption] = useState(false)
    const [numPeople,setNumPeople]=useState(1)
    return (
    <ScrollView
      style={{
        padding:20,
        backgroundColor:"white"
      }}>
          <View><Text  style={{textAlign:'center',fontWeight:"700",fontSize:30,paddingBottom:20}}>Create Bounty</Text></View><Divider style={{marginBottom:10}}/>
      {/* amount description title location type user whether group direcitons in steps? optional image */}
      <View style={{flexDirection:'row',alignItems:'center'}}>
          
          <View style={{flex:1,marginRight:10}}>
      <Input
        style={styles.input}
        textStyle={styles.inputText}
        size='large'
      placeholder='Enter bounty title..'
      value={title}
      /* caption="Get people interested in the bounty" */
      label='Bounty Title'
      onChangeText={nextValue => setTitle(nextValue)}
    />
    <Input
      placeholder='Enter bounty amount..'
      style={styles.input}
      size={'large'}
      value={amount}
      /* caption="How much are you willing to give up?" */
      label='Bounty Amount'
      accessoryRight={(props)=><Icon name="gift-outline" {...props}/>}
      onChangeText={nextValue => setAmount(nextValue.replace(/[^0-9]/g, ''))}
    /></View>
    <View style={{flex:1}}>
    <Image style={{width:"100%",height:undefined,aspectRatio:1}} resizeMode="contain" source={require("../images/logo.png")}/></View>
    </View>
    <Input
      placeholder='Enter bounty description..'
      style={styles.input}
      multiline={true}
      value={description}
      textStyle={{minHeight:64}}
      caption="Give some instructions.."
      label='Bounty Description'
      /* accessoryRight={(props)=><Icon name="eye" {...props}/>} */
      onChangeText={nextValue => setDescription(nextValue)}
      onSubmitEditing={Keyboard.dismiss}
    />
    <Datepicker
        label='Expiry Date'
        caption='Your bounty will expire at this date..'
        placeholder='Pick Date'
        date={date}
        style={{width:'100%',...styles.input}}
        onSelect={nextDate => setDate(nextDate)}
        accessoryRight={(props)=><Icon name="calendar-outline" {...props}/>}
      />
<View style={{height:40,display:'flex',flexDirection:'row',alignItems:'center',...styles.input}}>
    <Toggle checked={showGroupOption} style={{marginRight:10}} onChange={()=>setShowGroupOption(!showGroupOption)}>
      {!showGroupOption&&"Group Event"}
    </Toggle>{showGroupOption&&<Input
      placeholder='Enter # people..'
      value={numPeople}
      size="large"
      accessoryRight={(props)=><Icon name="people-outline" {...props}/>}
      onChangeText={nextValue => setNumPeople(nextValue)}
      onSubmitEditing={Keyboard.dismiss}
    />}</View>
      <ButtonGroup style={{backgroundColor:'white',...styles.input}} appearance='filled'>
      <Button>Volunteer</Button>
      <Button >Cleaning</Button>
      <Button >Movement</Button>
    </ButtonGroup>
    

       <Button style={{width:'100%'}} /* accessoryRight={StarIcon} */>
      HELP WANTED!
    </Button>

    
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    input:{
        
        marginBottom:15,
    }
})

export default CreateBounty;