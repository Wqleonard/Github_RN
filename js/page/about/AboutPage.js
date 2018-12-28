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
    ScrollView, StyleSheet, Text, View, TouchableOpacity, DeviceInfo
    ,Linking
} from 'react-native'


import {MORE_MENU} from '../../common/MORE_MENU'
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil'
import NavigationUtil from '../../navigator/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import config from '../../res/data/config'
const THEME_COLOR = '#678'
type Props = {};
export default class AboutPage extends Component<Props> {
    constructor(props){
        super(props)
        this.params=this.props.navigation.state.params
        this.aboutCommon=new AboutCommon({
            ...this.params,
            navigation:this.props.navigation,
            flagAbout:FLAG_ABOUT.flag_about
        },data=> this.setState({...data}) )
        this.state={
            data:config
        }
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


       onClick(menu){
          let RouteName,params={}
          switch (menu) {
              case MORE_MENU.Tutorial:
                  RouteName='WebViewPage'
                  params.title='教程'
                  params.url='https://coding.m.imooc.com/classindex.html?cid=89'
                  break
              case MORE_MENU.Feedback:
                  const url='mailto://crazycodeboy@gmail.com'
                 Linking.canOpenURL(url)
                     .then(support=>{
                         if(!support){
                             console.log('Can\'t handle url:'+url)
                         }else{
                             Linking.openURL(url)
                         }
                     })
                     .catch(e=>{
                         console.error('An error occurred',e)
                     })
                  break
              case MORE_MENU.About_Author:
                  RouteName='AboutMePage'
                  break
          }
          if(RouteName){
              NavigationUtil.goPage(params,RouteName)
          }
       }

       getItem(menu){
        return ViewUtil.getMenuItem(()=>
         this.onClick(menu),menu,THEME_COLOR)
       }

       render(){
        const content=<View>
            {this.getItem(MORE_MENU.Tutorial)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.Feedback)}
        </View>
           return this.aboutCommon.render(content,this.state.data.app)
       }
}
