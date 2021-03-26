import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen';
import RecieverDetailsScreen from '../screens/RecieverDetailsScreen';

export const AppStackNavigator = createStackNavigator({
 OffersList  : {
    screen : HomeScreen,
    navigationOption: {
      headerShown: false
    }
    },
  RecieverDetails : {
    screen : RecieverDetailsScreen,
    navigationOption: {
      headerShown: false
    }
  },
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })
