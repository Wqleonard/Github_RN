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
    ,Linking,Clipboard
} from 'react-native'
import Toast from 'react-native-easy-toast'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {MORE_MENU} from '../../common/MORE_MENU'
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil'
import NavigationUtil from '../../navigator/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import config from '../../res/data/config'
import WebViewPage from "../WebViewPage";
const THEME_COLOR = '#678'
type Props = {};
export default class AboutMePage extends Component<Props> {
    constructor(props){
        super(props)
        this.params=this.props.navigation.state.params
        this.aboutCommon=new AboutCommon({
            ...this.params,
            navigation:this.props.navigation,
            flagAbout:FLAG_ABOUT.flag_about_me
        },data=> this.setState({...data}) )
        this.state={
            data:config,
            showTutorial:true,
            showBlog:false,
            showQQ:false,
            showContact:false,
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


       onClick(tab){
         if(!tab) return
         if(tab.url){
             NavigationUtil.goPage({
                 title:tab.title,
                 url:tab.url,
             },'WebViewPage')
             return
         }
         if(tab.account&&tab.account.indexOf('@')>-1){
             const url='mailto://'+tab.account
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
             return
         }
         if(tab.account){
             Clipboard.setString(tab.account)
             this.toast.show(tab.title+tab.account+'已复制到剪切板。')
         }
       }

       // getItem(menu){
       //  return ViewUtil.getMenuItem(()=>
       //   this.onClick(menu),menu,THEME_COLOR)
       // }

    /**
     * 主标签
     * @param data
     * @param isShow 是否展开
     * @param key  isShow的key
     * @returns {*}
     * @private
     */
       _item(data,isShow,key){
          return ViewUtil.getSettingItem(()=>{
              this.setState({
                  [key]:!this.state[key]
              })
          },data.name,THEME_COLOR,Ionicons,data.icon,isShow?'ios-arrow-up':'ios-arrow-down')
       }

    /**
     * 副标签
     * @param dic 数据数组
     * @param isShowAccount  文本后是否是有数字，QQ群等
     */
       renderItems(dic,isShowAccount){
          if(!dic) return null
          const views=[]
        let index=0
          for(const item of dic){
              const title=isShowAccount?item.title+':'+item.account:item.title
              views.push(
                  <View key={index}>
                      {ViewUtil.getSettingItem(()=>{this.onClick(item)},title,THEME_COLOR)}
                      <View style={GlobalStyles.line}/>
                  </View>
              )
              index++
          }
        return views
       }

       render(){
        const content=<View>
            {this._item(this.state.data.aboutMe.Tutorial,this.state.showTutorial,'showTutorial')}
            <View style={GlobalStyles.line}/>
            {this.state.showTutorial?this.renderItems(this.state.data.aboutMe.Tutorial.items):null}

            {this._item(this.state.data.aboutMe.Blog,this.state.showBlog,'showBlog')}
            <View style={GlobalStyles.line}/>
            {this.state.showBlog?this.renderItems(this.state.data.aboutMe.Blog.items):null}

            {this._item(this.state.data.aboutMe.QQ,this.state.showQQ,'showQQ')}
            <View style={GlobalStyles.line}/>
            {this.state.showQQ?this.renderItems(this.state.data.aboutMe.QQ.items,true):null}

            {this._item(this.state.data.aboutMe.Contact,this.state.showContact,'showContact')}
            <View style={GlobalStyles.line}/>
            {this.state.showContact?this.renderItems(this.state.data.aboutMe.Contact.items,true):null}
        </View>
           return <View style={{flex:1}}>
               {this.aboutCommon.render(content,this.state.data.author)}
               <Toast
                 ref={toast=>this.toast=toast}
                 position={'center'}
               />
           </View>
       }
}
