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

export default class WebViewPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    const {title,url}=this.params
    this.state = {
      title,
      url,
      canGoBack:false,
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


  render() {
    const navigationBar = (
      <NavigationBar
        title={this.state.title}
        style={{ backgroundColor: THEME_COLOR,paddingTop: DeviceInfo.isIPhoneX_deprecated?30:0, }}
        leftButton={ViewUtil.getLeftBackButton(()=>{this.onBack()})}
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
  },
})
