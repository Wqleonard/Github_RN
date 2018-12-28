/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
    ScrollView, View, DeviceInfo, Text, StyleSheet
} from 'react-native'
import { connect } from 'react-redux'
// import NavigationUtil from '../navigator/NavigationUtil'
import actions from '../action/index'
// import DetailPage from './DetailPage'
// import NavigationBar from '../common/NavigationBar'
import NavigationBar from "../common/NavigationBar";
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import LanguageDao from "../expand/dao/LanguageDao";
import ViewUtil from "../util/ViewUtil";
const favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_popular)
const URL = 'https://api.github.com/search/repositories?&q='
const QUERY_STR = '&sort=stars'
type Props = {};
const THEME_COLOR = '#678'
class CustomKeyPage extends Component<Props> {
    /**
     * 获取标签
     * @param props
     * @param original 移除标签使用，是否从props获取原始的标签
     * @param state 移除标签使用
     * @private
     */
    static _keys(props,original,state){
       const {flag,isRemoveKey}=props.navigation.state.params
       const key=flag===FLAG_LANGUAGE.flag_key?'keys':'languages'
        if(isRemoveKey && !original){

        }else{
            return props.languages[key]
        }
    }

  constructor(props) {
    super(props)
    this.params=this.props.navigation.state.params
    const {flag}=this.params
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)})
    this.changeValues=[]
    this.isRemoveKey=!!this.params.isRemoveKey
    this.title=this.isRemoveKey?'标签移除':flag===FLAG_LANGUAGE.flag_language?'自定义语言':'自定义标签'
    this.rightButtonTitle=this.isRemoveKey?'移除':'保存'
    this.languageDao=new LanguageDao(flag)
    this.state={
        keys:[]
    }
  }

    componentDidMount(): void {
        this.backPress.componentDidMount()
        if(CustomKeyPage._keys(this.props).length===0){
            this.props.onLoadLanguage(this.params.flag)
        }
        this.setState({
            keys:CustomKeyPage._keys(this.props)
        })
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount()
    }

    //此处点击android物理返回键
    onBackPress(e){
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

  // componentWillReceiveProps(nextProps): void {
  //     if(nextProps){
  //      const b=  nextProps.navigation.getParam('aaa')
  //     }
  // }

    onSave(){

    }

    renderView(){
        const dataKeys=this.state.keys
        if(!dataKeys&&dataKeys.length===0){
            return
        }
        const len=dataKeys.length
        const views=[]
        for(let i=0;i<len;i+=2){
            views.push(
                <View key={i}>
                   <View style={styles.item}>
                     <View style={styles.line}/>
                   </View>
                </View>
            )
        }

    }

    render() {
        const statusBar={
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        }
        let navigationBar=
            <NavigationBar
                title={this.title}
                statusBar={statusBar}
                rightButton={ViewUtil.getRightButton(this.rightButtonTitle,()=>{
                     this.onSave()
                })}
                style={{backgroundColor:THEME_COLOR,paddingTop: DeviceInfo.isIPhoneX_deprecated?30:0}}
            />
    return (
      <View
        style={styles.container}
      >
          {navigationBar}
          <ScrollView>
              {this.renderView()}
          </ScrollView>
      </View>
    )
  }
}
const mapCustomStateToProps=state=>({
    language:state.language
})
const mapCustomDispatchToProps=dispatch=>({
    onLoadLanguage: flag=>dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapCustomStateToProps,mapCustomDispatchToProps)(CustomKeyPage)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    item:{
        flexDirection: 'row',
    },

    line:{
        flex:1,
        height: 0.3,
        backgroundColor:'darkgray'
    }
})