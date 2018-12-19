/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";


type Props = {};
export default class MyPage extends Component<Props> {
  render() {
    const {navigation} =this.props
    return (
      <View style={styles.container}>
         <Text style={styles.welcome}>MyPage</Text>
          <Text onPress={()=>{
              NavigationUtil.goPage({},'DetailPage')
          }}>跳转到详情页</Text>
          <Button
              title='Fetch 使用'
              onPress={()=>{
                  NavigationUtil.goPage({navigation:this.props.navigation},'FetchDemoPage')
              }}/>
          <Button
              title='AsyncStorage 使用'
              onPress={()=>{
                  NavigationUtil.goPage({navigation:this.props.navigation},'AsyncStorageDemoPage')
              }}/>
          <Button
              title={'离线缓存框架 使用'}
              onPress={()=>{
                  NavigationUtil.goPage({navigation:this.props.navigation},'DataStoreDemoPage')
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
