/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {BackHandler} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'
import {Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
type Props = {};
class HomePage extends Component<Props> {
  constructor(props){
    super(props)
    this.onBackPress=this.onBackPress.bind(this)
    NavigationUtil.navigation=this.props.navigation
  }
  componentDidMount(): void {
    BackHandler.addEventListener('hardwareBackPress',this.onBackPress)
  }

  onBackPress(){
    const {dispatch,nav}=this.props
    if(nav.routes[1].index===0){
      //如果RootNavigator中的MainNavigator的index为0，则不处理返回键
      return false
    }
    dispatch(NavigationActions.back())
    return true
  }
  componentWillUnmount(): void {
    BackHandler.removeEventListener('hardwareBackPress',this.onBackPress)
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
const mapStateToProps=state=>({
  nav:state.nav,
})
export default connect(mapStateToProps)(HomePage)