/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createMaterialTopTabNavigator}  from 'react-navigation'
import NavigationUtil from "../navigator/NavigationUtil";
import DetailPage from "./DetailPage";

type Props = {};
export default class PopularPage extends Component<Props> {
  constructor(props){
    super(props)
    this.tabNames=['Java','Android','iOS','React','React Native','PHP']
  }
  _getTabs(){
    const tabs={}
    this.tabNames.forEach((item,index)=>{
      tabs[`tab${index}`]={
        screen:props=><PopularTab {...props} tabLabel={item}/>,
        navigationOptions:{
          title:item
        }
      }
    })
    return tabs
  }
  render() {
    const TabNavigator=createMaterialTopTabNavigator(
        this._getTabs(),{
          tabBarOptions:{
            tabStyle:styles.tabStyle,
            upperCaseLabel:false,//是否标签大写，默认为true大写
            scrollEnabled:true,//是否支持滚动，默认为false不滚动
            style:{
              backgroundColor: '#678',//tabBar背景色
            },
            indicatorStyle:styles.indicatorStyle,//标签指示器的样式 横线
            labelStyle:styles.labelStyle,//文字的样式
          }
        }
    )
    return (
        <View
            style={{flex: 1,marginTop: 30}}
        >
          <TabNavigator/>
        </View>
    );
  }
}
class PopularTab extends Component<Props> {
    constructor(props){
      super(props)
      NavigationUtil.navigationTab=props.navigation
    }
  render() {
    const {tabLabel, navigation}=this.props
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>{tabLabel}</Text>
          <Text onPress={()=>{
            NavigationUtil.goPage({},'DetailPage')
          }}>跳转到详情页</Text>
          <Text onPress={()=>{
            navigation.navigate('PopularTab2')
          }}>跳转tab2</Text>
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
  tabStyle:{
     minWidth: 50,
  },
  indicatorStyle:{
    height: 2,
    backgroundColor:'white',
  },
  labelStyle:{
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
});
