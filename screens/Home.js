import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Image, ScrollView, Easing, Dimensions } from 'react-native';
import API_URL from '../api/API_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Modal, Card, Icon, Layout, Text, Button, Input } from '@ui-kitten/components';
import NumericInput from 'react-native-numeric-input'


import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const backIcon = (props) => (
  <Icon {...props} style={[props.style, { width: 50, height: 50 }]} fill="black" name='arrow-ios-back-outline'/>
);

const forwardIcon = (props) => (
  <Icon {...props} style={[props.style, { width: 50, height: 50 }]} fill="black" name='arrow-ios-forward-outline'/>
);

const userIcon = () => (
  <Icon style={{ width: 25, height: 25, top:5, marginRight:10 }} fill="black" name='person-outline'/>
);

function days_between(date1, date2) {

  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1 - date2);

  // Convert back to days and return
  let day = Math.round(differenceMs / ONE_DAY);
  if(day >= 31){
    return Math.round(day/30);
  }
  if(day != 0){
    return day + " days";
  }
  return "Today"

}

export default Home = ({route}) => {
  const[data, setData] = useState([])
  const[selected, setSelected] = useState(0);
  const[visible,setVisible] = useState(false);
  const[payVisible, setPayVisible] = useState(false);
  const[donationAmount,setDonationAmount] = useState(0);

  async function getAllPosts(amount){
    let token = await AsyncStorage.getItem("token")
		let res = await fetch(`${API_URL.api}/api/wante/getAllPosts`,{
			method: "POST",
			headers: {
				Authorization: "Token " + token,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body:JSON.stringify({
				"pages": amount
			})
		});
    setData((await res.json())["data"]);
  }

  useEffect(()=>{
    getAllPosts(10);
  }, [])

  function getTheme(theme){
    const themes = ["Climate Change", "Energy", "Food", "Littering/Trash", "Waste", "Transportation", "Water", "Other..."]
    if(theme == "Climate Change"){
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANkAAADoCAMAAABVRrFMAAABO1BMVEX///8jlOCh42fsb1n60VwAjd6i5GWk5WIAjt6m514Wkd/71lwYkOXraFml5mD601x7t+nG3vS72PPsa1TrZ09Up+USjubraFCIvuvb6/nrYkh4x5mS2XnrZ1kbkeSo6Fvq9PxIp8iI0oVnu6yY3XFRrb5KqcVEoOP86udtsujufWr1uK/51M/2uls9oc7V6Pit0vGCzY/zqp/xmYv2wbmV23XzpVrxllruhXPynVrtdFlwwaOO1n8ol9t8yZYxm9ZetbU5n9HwkoP749/5yVzvhFnwjFqZx+5kua8AietywqJWsLzA6Lr+9fT3ysT1vLP0rlv73pCt7FGm35bK6dHl8+uh34jP7cy756zyn5PqWTvK7L/i8+W+6qOq45LzpG75zoD72Xv9677++ev98dL85Kf72oD506n0sZSN5MEaAAAURElEQVR4nO2dfV/bOpaAcYLtWHEc3uJAoE4IISm0lya09PYSnISWNhSWtvfuzsx2du/sdmZndr//J1jJr5JtWZLjvLDL+aM/SmnQ43N0ztHRkby2lru0NremuxsntV7PlqDYvVrtZHfa39xr5f+7FiV7/d2aXZJLJQBFCgX9tVSSZam30d9sLXuUorI5rclyiQBKEID4Tvp7yx4tr7ya9mSZBUXgQbrWskfNlM0NSYAqoJNle7rKqnu1AWRhqpCuN20tmyBRWlOJggV03TRNXbdY1CW5trVsjJhs1mjaAub1sA1lMDy2TRYckKXVUlzfplqhbo80Q4GiqppydWubLMUB+WRlZtwUPmnaMK0jQy0EohjNdle3XGQ9YLR0y/umx1Z7tWwmJFNQoj5/8+xCK+CiKmrz4B7pTR+0x8BhN6XjUac9AZg2V4GtL9G5gD5sKgRYYX9wUFB+60AmU22OAfQt17dtTVMVxTAGh5jiINtSbXKzR7VDqJXrA1Jh0BqvJFO3x4fHlvVZadpW9+4CTkJfn9rBBIQmCuSNpXG1TlKiFzBvjYjCEFrhUIeaMseTgaK0Fags4l+1wtDG2Er95YBN06KyJbWjCvMGPzGtCdSUijDjYqijcTjhSr0lTLe9NEMEZregJowbibb/+YL2b45Rqvu2Hprk7qLBGAobRV0HrparFC5Xb0MQ+JKStFC1tXp0jwh9fbdjpI2cDh2wFe5Dk1yk2rZS8169naIwTlG0g+vAJOVea0FgGykzDKnsamYwxGYMAy8JwOYiuNItEelsmOYg+MXonJmB2qbzB3vFXFdax46/n11xihaqTT6ZN1g/3RId2xk3VUMrsDwgjxgXY3+2gTlPtl02GBxEe39yBj4PcjBKRb33LRJI80wkT3jA0AJFH+v6Uarr5xVtFFrk/PxIjeE7Qq11f7uzDhPTK2ExDmw/bMvzqiX0uKs3els1Ose5gMF0qxCENnk+KTI/mKQfKDAg5UQGP+nYn2xzQRMAk/T9fEKaL83JHNFEwCS9m88cC9GOArS851pNAMwyj3NJsCho+XrIE16vKMH1/qSj5Q1GoOW5rOEK0C6XdFSYAxeBBlq5gXGkVB6XfackVD9yRgNSXmiv+MCAeTYy8vWJETTPQ4JSTl6kxeU8LPOwrc2TC6F19VxLI1z+HtwfzL6SZop6Zsm1Vl5gGzxuEZz9Nn8umI0o48RI/eVDBrBNrkkGDkcLACsY/5wwwufnjdcZwFq8gczMOaFKEEX5l/gAX75v1LczgPHnHmCcc0IVE+OPrdjwvpw2tos7XzKATXlDNFRaOzLTlHwjtvZPsdG9Ke4UoZxmAGvxg8GpRipNuRpf5afGBEv0uLKpTCzBPwh0pGhGQWlb5lFealM6f4gM7YvHBckygPFlVUB3xbx315qKYbS7h4aiXunmWXodnFfUixY5sufvGh5Xcfu7OBifXwTdiwNP3FF0jsampR8aBaOtW9Z+DgFc/WNkZC+g3/Bl56U42QlfWnWsKZ6gURhtyyk26d1mwRiYwDxWZkWLgn043SmGsvMgDMaZCHslYU8QjPt9HX4f/k2ypBnLxVEwXGHZPCOn+yDItEGwgyLpk2ZBG5mSPnTmmqJmA1QuiFE9vMMVBqfZe2GwLU6Pj5MhkFDMiVbQ9nUwNpC37OxnKiEoHWJUH+qEwiDZuTAZHxdBphJgEO2oqUIlwhgOg5tuZir7KIS7f9MoRqT+QhSsz5swYmTaYcSAzWHz1pKse/gT0ErNC3GlGf+OD+o8BpaBjFdlOJkR/TfwedCFsJZS0O49QkEwIqV6vRMDK9ZFrZFbZRiZ0jYj/zQeGRJwCqvqPlSa1RFUmvIXfEzvE8DE5xm3yiBZ01u/NKEx+gkJFGBNmlob+UpwrRkj+IX49gwTrLgtuDbjdYzOsO8GME80NHWiA7O778voGoB2s+vMPP1APQOo6ISegdMRyMWl/Qkb0vdEMOF4JpIKA92U7o+OjiXLktpN1RekQd3bIAJnkkt419QKnYP2/hEPGmGLCc7DU5oQGGf6EYqF2mnNww42YMJRel8C+8yGP6vrn3l8Ce7wX9LAio3nImR8GSMGZndv70YdIvmNhQAHzTuUYHGQqZhffE4xRSg7bwTARBacSPTjpmaokewpkcwHtNlkRPJxuk0lE3IhU26X74EljTOV7JpNZmDu45yuMrGVpy0Glpw14WTRHhIr8VmQKsMS4Q/USeaQ8S/QxPyH1U0OUsZt0KAPDsd4BzTykUzfiKssxRaLQrF6V8R/gDPa49c6R16DqXnRvJpIYbMpRzKiYEH6TZotIuEmE9GYZE2oeYViKKNrEynLQI20d9embjli3qXnIqi3H3OMqRorChSvBI2RTgZFbV4dW6Zbr1ObF3eTYyTJjbgh1+9/+kMrHM8Llsq233GSCRkjg8xZct76zXOKCpMwTYvvHeIBw/hLpADHUhl/sBYyRiYZMkqWu1CHYY+WES0Ff2GpjDuk7YmFaZNJxhZVsvymafVfo+NJd4zeTOOqX/GvzByw2xwq3MaRabsFLiVaWWTEMl9pXI5fpPNDMu+as4PBREq3rpHqlUJsOOd1DrJig0dpYmD57EloXWChTMaIb5Cd8oBxKU1kmum3eWgMijowUXlS+z02nOc8xsinNIFpBs5yAoNKs4FkDkfx4TDzD19p7H2LDX5rBKIFG7oYRzBVMbE2D18Frzk8o6s0Zkzr8dviMLcORpjZ66CEt3f71Q1OLp4qOPc0A3Z+YMiHSFIrHMX5n12lPXAaI1Iao3OC34HojLRWUBS8OPCh4Y2TK5p5SmNkj7zNYzCtyuGsAU6GFweC/J3XgThKi6f8D9iidMrdJZFTa7cvRHGg7gcovjjtS5wMK9lxV62sfNrxfcFVhkzQs63vvK4RyU5s8+L5n78GX3O7xpyboGPFAbdu816ErFiPhusPjbD8wwuWMxmuMnfZ4rqQd2Jk0Rzr5U6wCcVfacyXTP23cDgujDskMbJYuIYPqe59KeD08yULR/PVdYfbTqzmy4cDiYbrr/XijjfTNrmzxlzJVCwVJp6/IFk0XJ8jlbtfbi2HTAv3bIMI5vh9QWuMhmvkgLxCK3+mnycZXg/Gnv+DOFmxQRSMT0NY7kCdKxmWWGG7SWjSiHn9oj89icfkFkn4K3J5khlhHQ5HaXzlX8SE/wnLsdxla93xIfyrsxzJsGBG5vaNN+ckWeXjLyJKe+l8mmuOSyHDKnGRDDiSNVa+lb9VmEoLZ9oL9/87lQT+zc4cybC6TqrHuLwpV9lkmHv0bNlZNyyDTNFCY0xbjl3eVNerPzHJsJjmPSanhCxAxt4C4xJDOzgKyFIr3RBsvXrzjEkW1MKDulddiAzkcyxQHY7N8Faac7oxVn6CYFCYYGEtPHhOKJ0RqFxhDdEziDHRsTtp6MlU5W3ZASt/5CD7Skwzd6IJkFnHeVQb1cFnMzgD+EBfQV+6YOvlX9gTzW/rCf6OEjWRvbN8bstQR5OWT0av5/i2yOVCvMVMmM4gdylCRt+hFkMzOBzIR09lEI0N5q3t8EqDSN6IlLafRykE2395QbPGQGXQHH9mK80NadhjgrFabPMsl8KcchCQUes5l4HKuPy+4x1xA4Ahjn995pB1c3Ai2GYgLbOv/BKS8XnHl2Q6A//Ov6Z27XE4+1TDev1ouVXlphqS8fgQONEIbwTdvuAmtWS2yakWHLUQIPudSXaJgXEpDaYhhP4hqWiXHLCuQjTFKFwNBoMDsbSLg+xTGSer3nBkxWQAQQFN9AJXIF2hOwpRB61WuJVMdCWqWK7MJqu8JXTGFa3Jj0Jk/NtnPpo5aTsyuvc6yMBZU8QksXlG8SCYz/e0dskkIz8J7YgKdRa4YqGba9HVtcF3ghNbOZHdRMl+4vD8BNlr0dYkiui6/pk7X8a8PiWeVcrrESm/5cixImRioToFjp8srIJQFjGXMTKuoIaTfc/Q9T0zmToIyL4mZ1cJZFWedRpJJur2ZyZTOoCVEX+Mk/Hl/CEZqjeL9RDPTqYd6qxVTBKZ2FTbRsk/Wnta7JHnRaYNzfD2GUonQSLZevkTP1od9fRDF2Lhl+fOl0w5MPHbkJLHlTDPnKnGjmq+OLsWMHPU97WhNCMbL5kNJBDezZhc7E4m48myAjKnUOeUpQzlzp6JTee6CbB5DA0f1KhLz8pb589kMoGp5vabocIcasgz9mdh42qqMPbdo3gBWdSFfCx/QmTJYAJRzW2egBNNd66NUI39MfPOeKrErp5IMMUD94iyHDjHNdKFPLtx6vix7ErUHr1dDBjRrFt3aaJqo+usbBwtgurY/WzMhRCZY+XnspP8xjLiUGk8NbqwRdCWnBPQHtvgLCObyZpp2r13qhyElyERezFIV2iLIrqKwf0jl878g1wwKTZDz6Zq7TM9nYGiNMZ5JdSH6okdkBEtqM6CE82lTxQXwutE/D0MmDoSrUdKc5AJjTHTtG6QEGATDethd40QzSWK28eV9ilVZ/6no95FfJKgcJpFael7GsZteLd3WNnHkuJngVqoLgSVH92n8DYFLewSQeaIV7YzkjHOvDsnrL1nEEY0bAfNT6rKn559o5J5i9DKt5QMOTwvicxxgj1v5SIbWXo7HX6uHDPHwDsGRcZq9ZI+0dbLvuXSdYb1LKFiCD6GTjaydB+iXISzFzPHYJ+hEiiqelOkgnnmWFkvU80R736ZlogtzaxkjAN0CvYMeuEv9/fQsChWvaFGtHV35/pjuUr1kvidDTBYg+vQh2AzQkzS96Ga4zBQYubohzTcbVSpYO4SFFoufSlKHFKAuSPms7VxxjxEH6SRaV3siCt2c6E30Z7RHSJBhjIspN8qpZ5FtmJBHxKmtMYwo8oYEc2Y4Cvc8Jd7bYC8ZE5Egz9apizXyE4s5EN0z5TwmS6qs9RFmnqHfTD+ApXYPEtHu3QSTHriT4A5K2vvnhLtOvsrzVK4UHpFPLLwl39piJBBXTnqpTjH2OF/yQ+02m1mlTHWaGSYxK8ZdoryFXp4jpBVnJjuZSMMlTknEpzmgaxRGgmrzUfFnxnu+J28mNgOTLXGZ452k8kS7mtASkP3kkdvoBEQi7H2NAifiyvNOWicXLKKi/eDydaYcC9K33WParY83wFjXU4QuZDIxn47Svlp5Y+IytY9J5roQRpJdxpIzuIxc5RmG6N2RH40/n4RZI98LqT6k9/dkwCWfHQLKc02jLvMZKz12Sj6yfit128avBPNC3uJPQeUM5Iopg2bR5kLxulkzbvYBAb4C89e1yPb0yzdJXQ+JpxucgTd12t1bjOTpZUc0cvC4v+DuGD+dJs3ornGGHeNderR+BqA6+JJdjJ6B6RSoNRWsN/+UNxOWZbFJT7J6LdroB0nkH1vhn6jgXphJz8vgB/1fKhzpo4UY6ynnGkVvI8nOkzawlO5kGgJG/Euh+c7/EqL58Pp5z6F7raNiUlry7LpH4st1BAa70yLqywxkoUi2tJDij6iTDSqysgkC6JxusdqrI+C5hbzsUdaWU47SzEFrI4F5eE/uOwx1hrI0Njs9phsjUaqvy2RLwb4Tw6tlb+RUXp7m+NW+pl25CkRTY1lH4REXnbzg22LkRJI/ZTrIhSB+w5jknzJpqIxamGRl938YGitHAFr8F4qzfVOhGQBdoLOlM5tim8UR4uA7Zzyvx9hhqmWUJaDS1nmu8WjBvkr3Y1Uy7/gc6wudCHsDFMtof7Nt+CLoP2VglYt33zENFZvnItdlc33Koskweuxvsu/50pEI69O+duPpD6e8s3PocK2G8UXwleA81/TEBU9Vv9W2P/JkVLkZZD/9aNMTLcq4qpUfDe/s/M6w53ta2u7Wb1ILA2JLqTpAuxWhO3XoAoOsda/fXy2jaS+09g+Pc+EhYT/XVqkRPN95YJ/UQTib3H721///us/fvzj17//9/+8f+fI6+8vvghdlBqTDL2qzujIfF9Rhcqy8klrpkHzSVbfT8bortg6FoB5vQ1ydjR8R1dVusLlIrm3gBfdZ0LTgzKP2myPM1QegLzbWkk0fdDUHDEGhxnbuBbBxv0OVmxY4zNHxvos7WnyybxfmZ7B+QNPMmN5bPZ0vhOO8TrxeUrJnO+LxfuZi+Ezynxf4oxE8IRaXlJawFvu91IqT3MTeYM9sByE8/3beYLN5+3NcRF431seMv8pFsqetMDZJp+wB5SjLMz9AzBfZx+XzcWobcEKc2VXnruTLEmLVpgre735mmSOb8gVFqFrDkQlxzfkissspXEWV285hjhvMtleRJlg4WRA7i2Za05kYLl2OD8yctNzWRIhm3XlvLJkoHZSmj16ryTZ7lqrfyLPCLeiZEg2d3uQjv+ys8iPrjAZlNbWBqQrsegAKMlybZfMZFabzJFX/Y2eVEowTlSkg9+XQW+3j+qIe5HZuhwWUlLJHGm92ppGblOxe7WN3f7Wq5b/M4+TDAl5WZ0ci8P/V8hKT2RLlSeyJ7InsvnLE9kT2RPZ/OWJ7PGRkXe1lSj7dywysjUULGZ7kyVkFk/ZwGORkS008tJrjY7gjY9UM2KSkUY93xFzC7YdTxxpwYVJhvcYxpdvS5JW8PJ6+pDYZGu9kv8pi9prZ0vrRC6hskbKlhAHGTRrGX1Kb979VULS6u/upjZF8ZCtraFPWSkuDuEje4zyRPb45NGSbW7UaidpzvqRku3ZslPNTuk/f5xkm0HZXp/SfuZRkuFpOjUJeZRk+DuByAPDmDxGMnJlJVNSiMdItpnLynMVJZ9qwSrK/3cy8ooAWk1htYSPjKwD2ck/tGLCR0YcOFyhRXOakL4R0LIQrKBIDXorJpF4RvUNQQ4mPxKw6MFW+s+1anIJlEpUe1092cOONqWXQFv96XQ1aqScEp7aWtChnMXJFkDtVaAkUxcxj1f6J7ZUm7aWPYx0+V/tKnvRrpQ9rgAAAABJRU5ErkJggg==';
    }
    if(theme == "Energy"){
      return "data:image/png;base64,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"
    }
    if(theme == "Food"){
      return "https://i.pinimg.com/originals/dd/9d/c9/dd9dc9d83423bc037b511d73b29e6b80.png"
    }
    if(theme == "Littering/Trash"){
      return "https://image.flaticon.com/icons/png/512/75/75227.png"
    }
    if(theme == "Waste"){
      return "https://www.maxpixel.net/static/photo/1x/Material-Design-Icon-Recycle-Bin-Misc-Boutique-Flat-1298035.png"
    }
    if(theme == "Transportation"){
      return "data:image/png;base64,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"
    }
    if(theme == "Water"){
      return "data:image/png;base64,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"
    }
    if(theme == "Other..."){
      return "https://i.pinimg.com/originals/87/65/d3/8765d36a04400d1ff47bd657f240ade7.jpg"
    }
  }

  const Header = (props) => (
    <View {...props} style={[props.style, styles.header]}>
      <Avatar source={{ uri: getTheme(props.theme)}} style={styles.avatar} />
      <View>
        <Text category='h6'>{props.title}</Text>
        <Text category='s1'>{props.user}</Text>
      </View>
    </View>
  );

  const Footer = (props) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Text category='s2' style={{width:"50%", color:"#cc0000", fontWeight:"bold", fontSize:15}}>
        {props.collected}/{props.bounty} collected
      </Text>
      <Text category='s2' style={{width:"50%", textAlign:"right"}}>
        Ends in: {days_between(Date.parse(props.date), Date.now())}
      </Text>
    </View>
  );
  
function ModalHome({navigation}){
  if(visible == false){
    navigation.navigate("1");
  }
  return(
    <View style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, left:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("5")} accessoryLeft={backIcon}></Button>
      </View>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, right:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("2")} accessoryLeft={forwardIcon}></Button>
      </View>
      <Text category="h3" style={{width:"100%", textAlign:"center"}}>{data[selected].name}</Text>
      <Text category="s1" style={{marginRight:"43%"}}>{userIcon()}{data[selected].user}</Text>
      <Image source={{uri:`${API_URL.api}${data[selected].image}`}} style={{width:"60%", height:undefined, aspectRatio:1, marginTop:20, borderRadius: 10}}/>
      <View style={{display:"flex", flexDirection:"row", marginTop: 20}}>
        <View style={{width:8, height:8, backgroundColor:"#141518", borderRadius:25, marginRight: 10}}></View>
        <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
        <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
        <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
        <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25}}></View>
      </View>
      <Button style={{width:"60%", marginTop: 20, borderRadius: 10}}
      onPress={()=>{
        setVisible(false);
        setPayVisible(true);
      }}>
        Donate Now!
      </Button>
    </View>
  )
}

function ModalWhat({navigation}){
  if(visible == false){
    navigation.navigate("1");
  }
  return(
    <View style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, left:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("2")} accessoryLeft={backIcon}></Button>
      </View>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, right:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("4")} accessoryLeft={forwardIcon}></Button>
      </View>
      <Text category="h3" style={{width:"100%", textAlign:"center"}}>What is it for?</Text>
      <Text category="s1" style={{marginTop: 10, width:"100%", textAlign:"center"}}>{data[selected].what}</Text>
      <View style={{position:"absolute", width:"100%", bottom: 40, display:"flex", justifyContent:"center", alignItems:"center"}}>
        <View style={{display:"flex", flexDirection:"row", marginTop: 20}}>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#141518", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25}}></View>
        </View>
        <Button style={{width:"60%", marginTop: 20, borderRadius: 10}}>Donate Now!</Button>
      </View>
    </View>
  )
}

function ModalWho({navigation}){
  if(visible == false){
    navigation.navigate("1");
  }
  return(
    <View style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, left:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("1")} accessoryLeft={backIcon}></Button>
      </View>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, right:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("3")} accessoryLeft={forwardIcon}></Button>
      </View>
      <Text category="h3" style={{width:"100%", textAlign:"center"}}>Who are we?</Text>
      <Text category="s1" style={{marginTop: 10, width:"100%", textAlign:"center"}}>{data[selected].who}</Text>
      <View style={{position:"absolute", width:"100%", bottom: 40, display:"flex", justifyContent:"center", alignItems:"center"}}>
        <View style={{display:"flex", flexDirection:"row", marginTop: 20}}>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#141518", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25}}></View>
        </View>
        <Button style={{width:"60%", marginTop: 20, borderRadius: 10}}>Donate Now!</Button>
      </View>
    </View>
  )
}

function ModalWhy({navigation}){
  if(visible == false){
    navigation.navigate("1");
  }
  return(
    <View style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, left:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("3")} accessoryLeft={backIcon}></Button>
      </View>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, right:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("5")} accessoryLeft={forwardIcon}></Button>
      </View>
      <Text category="h3" style={{width:"100%", textAlign:"center"}}>Why do this?</Text>
      <Text category="s1" style={{marginTop: 10, width:"100%", textAlign:"center"}}>{data[selected].why}</Text>
      <View style={{position:"absolute", width:"100%", bottom: 40, display:"flex", justifyContent:"center", alignItems:"center"}}>
        <View style={{display:"flex", flexDirection:"row", marginTop: 20}}>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#141518", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25}}></View>
        </View>
        <Button style={{width:"60%", marginTop: 20, borderRadius: 10}}>Donate Now!</Button>
      </View>
    </View>
  )
}

function ModalWhenWhere({navigation}){
  if(visible == false){
    navigation.navigate("1");
  }
  return(
    <View style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, left:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("4")} accessoryLeft={backIcon}></Button>
      </View>
      <View style={{width:"20%", height:"100%", position:"absolute", top:0, right:0, display: 'flex', justifyContent:"center"}}>
        <Button appearance="ghost" onPress={()=>navigation.navigate("1")} accessoryLeft={forwardIcon}></Button>
      </View>
      <Text category="h3" style={{width:"100%", textAlign:"center"}}>Where is it?</Text>
      <Text category="s1" style={{marginTop: 10, width:"100%", textAlign:"center"}}>{data[selected].where}</Text>
      <View style={{position:"absolute", width:"100%", bottom: 40, display:"flex", justifyContent:"center", alignItems:"center"}}>
        <View style={{display:"flex", flexDirection:"row", marginTop: 20}}>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#d6d6d6", borderRadius:25, marginRight: 10}}></View>
          <View style={{width:8, height:8, backgroundColor:"#141518", borderRadius:25}}></View>
        </View>
        <Button style={{width:"60%", marginTop: 20, borderRadius: 10}}>Donate Now!</Button>
      </View>
    </View>
  )
}

  return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: "white"
    }}>
    <Layout style={styles.container}>
      {
        (function(){
          let arr = []
          let index = 0;
          for(let obj of data){
            let stay = index;
            arr.push(<Card key={index} style={styles.card} header={(props) => <Header {...props} title={obj.name} user={obj.user} theme={obj.theme} />} footer={(props) => <Footer {...props} date={obj.date} bounty={obj.bounty} collected={obj.collected}/>} onPress={()=>{setVisible(true); setSelected(stay)}}>
              <Image source={{ uri: `${API_URL.api}${obj.image}`}} style={styles.image} />
              <Text>
              {obj.what}
              </Text>
              <View style={{backgroundColor:"#c2c2d6", width:"100%", height:20, marginTop: 20, marginBottom:10, borderRadius:10, overflow:"hidden"}}>
                <View style={{backgroundColor:"#e84c3d", width:`${obj.collected/obj.bounty}%`, height:"100%"}}></View>
              </View>
            </Card>)
            index++;
          }
          return arr;
        })()
      }
      {
        (function(){
          if(data.length == 0){
          return (
            <View style={{display:"flex", alignItems:"center", justifyContent:"center", height:Dimensions.get('screen').height * 0.8}}>
              <Text>
                No Active Donations At The Moment!
              </Text>
            </View>
          )
          }
        })()
      }
      {
        (function(){
          if(data.length > 0){
            return(
              <Modal visible={visible}
               backdropStyle={styles.backdrop}
               style={{width:"90%", height:"55%"}}
               onBackdropPress={() => setVisible(false)}>
                 <View style={{width:"100%", height:"100%", borderRadius:5, overflow:'hidden'}}>
                  <NavigationContainer>
                    <Stack.Navigator screenOptions={{headerShown:false}}>
                        <Stack.Screen name="1" component={ModalHome}/>
                        <Stack.Screen name="2" component={ModalWho}/>
                        <Stack.Screen name="3" component={ModalWhat}/>
                        <Stack.Screen name="4" component={ModalWhy}/>
                        <Stack.Screen name="5" component={ModalWhenWhere}/>
                      </Stack.Navigator>
                  </NavigationContainer>
                 </View>
              </Modal>
            )
          }
        })()
      }
      {
        (function(){
          if(data.length > 0){
            return(
              <Modal visible={payVisible}
               backdropStyle={styles.backdrop}
               style={{width:"90%", height:"38%"}}
               onBackdropPress={() => {setPayVisible(false); setDonationAmount(0)}}>
                 <View style={{width:"100%", height:"100%", borderRadius:5, overflow:'hidden', backgroundColor:"white", display:"flex", alignItems:'center', justifyContent:"center"}}>
                  <NumericInput
                    value={donationAmount}
                    onChange={value => setDonationAmount({value})}
                    totalWidth={330} 
                    totalHeight={40}
                    minValue={0}
                    valueType='real'
                    step={5}
                    rounded
                    iconStyle={{ color: 'white' }} 
                    rightButtonBackgroundColor='#E84C3D' 
                    leftButtonBackgroundColor='#E84C3D'/>
                    <View style={{width:330, display:"flex", flexDirection:"row", alignItems:"center", marginTop: 20, marginBottom:20}}>
                      <Text style={{width:"50%", color:"#E84C3D", fontWeight:"bold", fontSize:18}}>My Wallet: </Text><Text style={{width:"50%", textAlign:"right"}}>2000</Text>
                    </View>
                    <View style={{width:330, display:"flex", flexDirection:"row", alignItems:"center", marginBottom:20}}>
                      <Text style={{width:"50%", color:"#E84C3D", fontWeight:"bold", fontSize:18}}>Current Payment: </Text><Text style={{width:"50%", textAlign:"right"}}><Text style={{fontWeight:"bold", fontSize:20}}>-</Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;200</Text>
                    </View>
                    <View style={{width:330, height:2, backgroundColor:"black", marginBottom: 20}}></View>
                    <View style={{width:330, display:"flex", flexDirection:"row", alignItems:"center", marginBottom:20}}>
                      <Text style={{width:"50%", color:"#E84C3D", fontWeight:"bold", fontSize:18}}>Remaining: </Text><Text style={{width:"50%", textAlign:"right"}}>1800</Text>
                    </View>
                    <Button style={{width:330, height:40, borderRadius:10}}>Pay now!</Button>
                 </View>
              </Modal>
            )
          }
        })()
      }
    </Layout>
  </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginTop: 40,
    marginBottom: 135
  },
  card: {
    margin: 20,
    borderRadius: 10,
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 5
  },
  header: {
    flexDirection: 'row'
  },
  avatar: {
    marginRight: 24,
  },
  image: {
    height:300,
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width:"100%"
  },
});