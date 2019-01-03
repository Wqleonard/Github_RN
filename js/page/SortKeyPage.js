/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
    Text,
    View,
    DeviceInfo,
    Dimensions,
    StyleSheet,
    Alert,
    TouchableHighlight,
} from 'react-native'
import { connect } from 'react-redux'
import SortableListView from 'react-native-sortable-listview'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import _ from 'lodash'
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
class SortKeyPage extends Component<Props> {
    static _flag(props){
        const {flag}=props.navigation.state.params
        return flag===FLAG_LANGUAGE.flag_key?'keys':'languages'
    }

    /**
     * 获取标签
     * @param props
     * @param state 移除标签使用
     * @private
     */
    static _keys(props,state){
        //如果state中有checkedArray则使用state中的checkedArray
        if(state&&state.checkedArray&&state.checkedArray.length){
            return state.checkedArray
        }
        //否则从原始数据中获取checkedArray
        const flag=SortKeyPage._flag(props)
        const dataArray=props.languages[flag] || []
        const keys=[]
        for(const item of dataArray){
            if(item.checked) keys.push(item)
        }
        return keys
    }

    // 首次进去且tab主页没有点击过趋势，则languages为空，onLoadLanguage方法在本页第一次执行，异步的，state没接收到，需要在此方法重新setState
    static getDerivedStateFromProps(nextProps,prevState){
        const checkedArray=SortKeyPage._keys(nextProps,prevState)
        if((!prevState.checkedArray.length) && checkedArray.length){
            return {
                checkedArray:checkedArray
            }
        }
        return null
    }

    constructor(props) {
      super(props)
      this.params=this.props.navigation.state.params
      const {flag}=this.params
      this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)})
        this.title=flag===FLAG_LANGUAGE.flag_language?'语言排序':'标签排序'
      this.languageDao=new LanguageDao(flag)
      this.state={
          checkedArray:SortKeyPage._keys(props)
      }
    }

    componentDidMount(): void {
        this.backPress.componentDidMount()
        if(SortKeyPage._keys(this.props).length===0){
            this.props.onLoadLanguage(this.params.flag)
        }
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
        if(!ArrayUtil.isEqual(SortKeyPage._keys(this.props),this.state.checkedArray)){
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
                            this.onSave(true)
                        }
                    }
                ])
        }else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }

    onSave(hasChecked) {
        if (!hasChecked) {
            //如果没有排序则直接返回
            if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
                NavigationUtil.goBack(this.props.navigation)
                return
            }
        }
            //保存排序后的数据
            //更新本地数据
            this.languageDao.save(this.getSortResult())
            //重新加载排序后的标签，以便其他页面能够及时更新
            const {onLoadLanguage} = this.props
            onLoadLanguage(this.params.flag)
            NavigationUtil.goBack(this.props.navigation)
    }

    /**
     * 获取排序后的标签结果
     */
    getSortResult(){
      const flag=SortKeyPage._flag(this.props)
        //从原始数据中复制一份数据出来，以便对这份数据进行排序 checked=true/false都有
        const sortResultArray=[...this.props.languages[flag]]
        //获取排序之前的排列顺序
        const originalCheckedArray=SortKeyPage._keys(this.props)
        //遍历排序前的数据，用排序后的数据checkedArray进行替换
        for(let i=0,j=originalCheckedArray.length;i<j;i++){
            const item=originalCheckedArray[i]
            //找到要替换元素所在的位置
            const index=this.props.languages[flag].indexOf(item)
            //进行替换
            sortResultArray.splice(index,1,this.state.checkedArray[i])
        }
       return sortResultArray
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
                rightButton={ViewUtil.getRightButton('保存',()=>{
                     this.onSave()
                })}
                style={{backgroundColor:THEME_COLOR,paddingTop: DeviceInfo.isIPhoneX_deprecated?30:0}}
            />
    return (
      <View
        style={styles.container}
      >
          {navigationBar}
          <SortableListView
            data={this.state.checkedArray}
            order={Object.keys(this.state.checkedArray)}
            onRowMoved={e=>{
                this.state.checkedArray.splice(e.to,0,this.state.checkedArray.splice(e.from,1)[0])
                this.forceUpdate()
            }}
            renderRow={row=><SortCell data={row} {...this.params}/>}
          />
      </View>
    )
  }
}

class SortCell extends Component{
    render(){
       return <TouchableHighlight
           underlayColor={'#eee'}
           style={this.props.data.checked?styles.item:styles.hidden}
           {...this.props.sortHandlers}
       >
           <View
            style={{
                marginLeft: 10,
                flexDirection: 'row'
            }}
           >
               <MaterialCommunityIcons
                 name={'sort'}
                 size={16}
                 style={{marginRight: 10,color: THEME_COLOR}}
               />
               <Text>{this.props.data.name}</Text>
           </View>
       </TouchableHighlight>
    }
}

const mapCustomStateToProps=state=>({
    languages:state.language
})
const mapCustomDispatchToProps=dispatch=>({
    onLoadLanguage: flag=>dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapCustomStateToProps,mapCustomDispatchToProps)(SortKeyPage)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    item:{
        backgroundColor:'#F8F8F8',
        borderBottomWidth: 1,
        borderColor:'#eee',
        height:50,
        justifyContent: 'center'
    },
    hidden:{
        height: 0,
    },
    line:{
        flex:1,
        height: 0.3,
        backgroundColor:'darkgray'
    },
})