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
  StyleSheet, Text, View, WebView, TouchableOpacity, DeviceInfo
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import NavigationUtil from '../navigator/NavigationUtil'
const TRENDING_URL = 'https://github.com/'
const THEME_COLOR='#678'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";
import FavoriteUtil from "../util/FavoriteUtil";

export default class DetailPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    const { projectModel,flag } = this.params
    this.favoriteDao=new FavoriteDao(flag)
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName
    const title = projectModel.item.full_name || projectModel.item.fullName
    this.state = {
      title,
      url:this.url,
      canGoBack:false,
      isFavorite:projectModel.isFavorite
    }
    this.backPress=new BackPressComponent({backPress:()=>this.onBackPress()})
  }
  componentDidMount(): void {
    this.backPress.componentDidMount()
  }


  componentWillUnmount(): void {
    this.backPress.componentWillUnmount()
  }

  //此处点击android物理返回键
  onBackPress(){
    this.onBack()
    return true //表示我们处理了，不执行默认的
  }

  //此处点击导航的返回
  onBack() {
    if(this.state.canGoBack){
      this.webview.goBack()
    }else{
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  onNavigationStateChange(navState){
     this.setState({
       canGoBack:navState.canGoBack,
       url:navState.url
     })
  }

  onFavoriteButtonClick(){
    const {projectModel,flag,callback}=this.params
    // const isFavorite=projectModel.isFavorite=!projectModel.isFavorite 通过callback回调会给原属性的isFavorite重新赋值，此处可先不作赋值操作
    const isFavorite=projectModel.isFavorite=!projectModel.isFavorite
    callback(isFavorite)
    this.setState({
      isFavorite,
    })
    // const key=projectModel.item.fullName?projectModel.item.fullName:projectModel.item.id.toString()
    FavoriteUtil.onFavorite(this.favoriteDao,projectModel.item,isFavorite,flag)
  }

  renderRightButton(){
    return(
        <View style={{flexDirection: 'row'}}>
           <TouchableOpacity
             onPress={()=>this.onFavoriteButtonClick()}
           >
             <FontAwesome
                name={this.state.isFavorite?'star':'star-o'}
                size={20}
                style={{color:'white',marginRight: 10}}
             />
           </TouchableOpacity>
          {
            ViewUtil.getShareButton(()=>{

            })
          }
        </View>
    )
  }
  
  render() {
    const titleLayoutStyle=this.state.title.length>20?{paddingRight: 30}:null
    const navigationBar = (
      <NavigationBar
        title={this.state.title}
        titleLayoutStyle={titleLayoutStyle}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        rightButton={this.renderRightButton()}
        style={{ backgroundColor: THEME_COLOR }}
      />
    )
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webview=>this.webview=webview}
          source={{uri:this.state.url}}
          startInLoadingState={true}
          onNavigationStateChange={e=>{
            this.onNavigationStateChange(e)
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated?30:0,
  },
})
