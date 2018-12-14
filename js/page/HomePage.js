/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
// import {
//   createBottomTabNavigator,
// } from 'react-navigation'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import Entypo from 'react-native-vector-icons/Entypo'
// import PopularPage from './PopularPage'
// import TrendingPage from './TrendingPage'
// import FavoritePage from './FavoritePage'
// import MyPage from './MyPage'
import NavigationUtil from "../navigator/NavigationUtil";
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
type Props = {};
export default class HomePage extends Component<Props> {
  constructor(props){
    super(props)
    NavigationUtil.navigation=this.props.navigation
  }
  render() {
    return <DynamicTabNavigator/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
