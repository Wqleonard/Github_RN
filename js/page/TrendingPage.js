/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";


type Props = {};
export default class TrendingPage extends Component<Props> {
  render() {
    const {navigation}=this.props
    return (
      <View style={styles.container}>
         <Text style={styles.welcome}>TrendingPage</Text>
        <Button
           title={'改变主题颜色'}
           onPress={()=>{
             navigation.setParams({
               theme:{
                 activeTintColor:'red',
                 // inactiveTintColor:'grey',
                 updateTime:new Date().getTime()
               }
             })
           }}
        />
          <Button
              title={'跳转PopularTab页'}
              onPress={()=>{
                  NavigationUtil.goPopularTabPage({},'PopularTab2')
              }}
          />
      </View>
    );
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
