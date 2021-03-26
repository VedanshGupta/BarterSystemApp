import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from '../screens/HomeScreen';
import ExchangeScreen from '../screens/ExchangeScreen';



export const AppTabNavigator = createBottomTabNavigator({
  AcceptOffers : {
    screen: HomeScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/open.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Accept Barters",
    }
  },
  Exchange: {
    screen: ExchangeScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/barter.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Request Barters",
    }
  }
});
