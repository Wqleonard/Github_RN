/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
    ScrollView,
    View,
    DeviceInfo,
    Dimensions,
    StyleSheet,
    Alert
} from 'react-native'
import { connect } from 'react-redux'
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'
// import NavigationUtil from '../navigator/NavigationUtil'
import actions from '../action/index'
// import DetailPage from './DetailPage'
// import NavigationBar from '../common/NavigationBar'
import NavigationBar from "../common/NavigationBar";
import NavigationUtil from "../navigator/NavigationUtil";

import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import LanguageDao from "../expand/dao/LanguageDao";
import ViewUtil from "../util/ViewUtil";
import ArrayUtil from "../util/ArrayUtil";

type Props = {};
const THEME_COLOR = '#678'
const {width}=Dimensions.get('window')
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

    // 首次进去且tab主页没有点击过趋势，则languages为空，onLoadLanguage方法在本页第一次执行，异步的，state没接收到，需要在此方法重新setState
    static getDerivedStateFromProps(nextProps,prevState){
        const keys=CustomKeyPage._keys(nextProps,null,prevState)
        if(prevState.keys!==keys){
            return {
                keys
            }
        }
        return null
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
        const keys=CustomKeyPage._keys(this.props)
        // 首次进去且tab主页没有点击过趋势，则languages为空，onLoadLanguage方法在本页第一次执行，异步的，props里languages为空
        this.setState({
            keys,
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
        if(this.changeValues.length>0){
            Alert.alert('提示','要保存修改吗？',
                [
                    {
                        text:'否',
                        onPress:()=>{
                            NavigationUtil.goBack(this.props.navigation)
                        }
                    },
                    {
                        text: '是',
                        onPress:()=>{
                            this.onSave()
                        }
                    }
                ])
        }else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }

  // componentWillReceiveProps(nextProps): void {
  //     if(nextProps){
  //      const b=  nextProps.navigation.getParam('aaa')
  //     }
  // }

    onSave(){
      if(this.changeValues.length>0){
          //更新本地数据
          this.languageDao.save(this.state.keys)
          //更新store
          const {onLoadLanguage}=this.props
          onLoadLanguage(this.params.flag)
      }
        NavigationUtil.goBack(this.props.navigation)
    }

    onClick(data,index){
       data.checked=!data.checked
       ArrayUtil.updateArray(this.changeValues,data)
       this.setState({
           keys:this.state.keys
       })
    }

    _checkedImage(checked){
        // const {theme} =this.params
        return <Ionicons
          name={checked?'ios-checkbox':'md-square-outline'}
          size={20}
          style={{
            color:THEME_COLOR,
          }}
        />
    }

    renderCheckBox(data,index){
        return(
            <CheckBox
                style={{width: width/2, padding:10}}
                onClick={()=>{
                    this.onClick(data,index)
                }}
                isChecked={data.checked}
                leftText={data.name}
                checkedImage={this._checkedImage(true)}
                unCheckedImage={this._checkedImage(false)}
            />
        )
    }

    renderView(){
        const dataKeys=this.state.keys
        if(!dataKeys || dataKeys.length===0){
            return
        }
        const len=dataKeys.length
        const views=[]
        for(let i=0;i<len;i+=2){
            views.push(
                <View key={i}>
                   <View style={styles.item}>
                       {this.renderCheckBox(dataKeys[i],i)}
                       {i+1<len && this.renderCheckBox(dataKeys[i+1],i+1)}
                   </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        return views
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
                leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
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
    languages:state.language
})
const mapCustomDispatchToProps=dispatch=>({
    onLoadLanguage: flag=>dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapCustomStateToProps,mapCustomDispatchToProps)(CustomKeyPage)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
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