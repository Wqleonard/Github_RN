/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
  Button, StyleSheet, Text, View,TouchableOpacity
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from '../navigator/NavigationUtil'

const THEME_COLOR = '#678'
type Props = {};
export default class MyPage extends Component<Props> {
    constructor(props){
        super(props)
    }
    componentDidMount() {
       // onWillBlur：页面将要失去焦点
      //  onDidBlur：页面已经失去焦点
      //  onWillFocus：页面将要获得焦点
      //  onDidFocus：页面已经获得焦点  可以在获取焦点时自动调用方法刷新页面
        // 通过addListener开启监听，可以使用上面的四个属性
        this._didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                console.debug('didFocus', payload);
            }
        );
    }

    componentWillUnmount() {
        // 在页面消失的时候，取消监听
        this._didFocusSubscription && this._didFocusSubscription.remove();
    }


    getRightButton(){
      return(
          <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={{padding: 5,marginRight: 8}}>
                  <View>
                      <Feather
                        name={'search'}
                        size={24}
                        style={{color:'whiter'}}
                      />
                  </View>
              </TouchableOpacity>
          </View>
      )
  }
       getLeftButton(callback){
              return (
                  <TouchableOpacity
                   style={{padding: 8,paddingLeft: 12}}
                   onPress={callback}
                  >
                      <Ionicons
                        name={'ios-arrow-back'}
                        size={26}
                        style={{color: 'white'}}
                      />
                  </TouchableOpacity>
              )

       }

       render(){
            let statusBar={
                backgroundColor: THEME_COLOR,
                barStyle:'light-content',
            }
            let navigationBar=
                <NavigationBar
                  title={'我的'}
                  statusBar={statusBar}
                  style={{backgroundColor:THEME_COLOR}}
                  rightButton={this.getRightButton()}
                  leftButton={this.getLeftButton(()=>{
                      this.props.navigation.goBack()
                  })}
                />
           return(
               <View style={styles.container}>
                   {navigationBar}
                   <Text style={styles.welcome}>MyPage</Text>
                   <Button
                     title={'Fetch 使用'}
                     onPress={()=>{
                         NavigationUtil.goPage({navigation:this.props.navigation},'FetchDemoPage')
                     }}
                   />
               </View>
           )
       }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
      marginTop: 30
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
