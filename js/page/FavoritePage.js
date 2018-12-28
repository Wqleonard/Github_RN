/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet, ActivityIndicator, Text, View, FlatList, RefreshControl,DeviceInfo
} from 'react-native'
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import { connect } from 'react-redux'
import Toast from 'react-native-easy-toast'
// import NavigationUtil from '../navigator/NavigationUtil'
import actions from '../action/index'
// import DetailPage from './DetailPage'
// import NavigationBar from '../common/NavigationBar'
import PopularItem from '../common/PopularItem'
import NavigationBar from "../common/NavigationBar";
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import TrendingItem from "../common/TrendingItem";
import EventBus from 'react-native-event-bus'
import EventTypes from "../util/EventTypes";
import GlobalStyles from "../res/styles/GlobalStyles";
const URL = 'https://api.github.com/search/repositories?&q='
const QUERY_STR = '&sort=stars'
type Props = {};
const THEME_COLOR = '#678'
export default class FavoritePage extends Component<Props> {
  constructor(props) {
    super(props)
    this.tabNames = ['最热','趋势']
  }

  // componentWillReceiveProps(nextProps): void {
  //     if(nextProps){
  //      const b=  nextProps.navigation.getParam('aaa')
  //     }
  // }



    render() {
        let statusBar={
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        }
        let navigationBar=
            <NavigationBar
                title='最热'
                statusBar={statusBar}
                style={{backgroundColor:THEME_COLOR, paddingTop: DeviceInfo.isIPhoneX_deprecated?30:0}}
            />
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
        'Popular':{
            screen:props=><FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,
            navigationOptions:{
                title:'最热'
            }
         },
         'Trending':{
             screen:props=><FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,
             navigationOptions:{
                 title:'趋势'
             }
         }
        }, {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false, // 是否标签大写，默认为true大写
          style: {
            backgroundColor: THEME_COLOR, // tabBar背景色
            height: 30,//fix 开启scrollEnabled后在android上初次加载闪烁的问题
          },
          indicatorStyle:styles.indicatorStyle,//标签指示器的样式 横线
          labelStyle: styles.labelStyle, // 文字的样式
        },
      }
    ))
    return (
      <View
        style={{ flex: 1}}
      >
          {navigationBar}
        <TabNavigator />
      </View>
    )
  }
}
const pageSize = 10 // 设置常量
class FavoriteTab extends Component<Props> {
  constructor(props) {
    super(props)
      const {flag}=this.props
    this.storeName = flag
    this.favoriteDao=new FavoriteDao(flag)
  }

  componentDidMount(): void {
    this.loadData()
      EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.listener=data=>{
          if(data.to===2){
              this.loadData(false)
          }
      } )
  }

  componentWillUnmount(): void {
      EventBus.getInstance().removeListener(this.listener)
  }

    _store() {
    const { favorite } = this.props
    let store = favorite[this.storeName]// 动态获取state
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 要展示的数据
      }
    }
    return store
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData}=this.props
      onLoadFavoriteData(this.storeName,isShowLoading)
  }

  onFavorite(item,isFavorite){
      FavoriteUtil.onFavorite(this.favoriteDao,item,isFavorite,this.storeName)
      if(this.storeName===FLAG_STORAGE.flag_popular){
          EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
      }else{
          EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
      }
  }

  renderItem({ item }) {
    const Item=this.storeName===FLAG_STORAGE.flag_popular?PopularItem:TrendingItem
    return (
      <Item
        projectModel={item}
        onSelect={(callback) => {
            NavigationUtil.goPage({
              projectModel:item,
              flag:this.storeName,
              callback,
            },'DetailPage')
        }}
        onFavorite={(item,isFavorite)=>{
            this.onFavorite(item,isFavorite)
        }}
      />
    )
  }

  render() {
    const store = this._store()
    return (
      <View style={GlobalStyles.root_container}>
        <FlatList
          data={store.projectModels}
          renderItem={item => this.renderItem(item)}
          keyExtractor={item =>this.storeName+(item.item.id||item.item.fullName)}
          refreshControl={(
            <RefreshControl
              title='Loading...'
              titleColor={THEME_COLOR}
              tintColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => {
                this.loadData(true)
              }}
            />
)}
        />
        <Toast
          ref='toast'
          position='center'
        />
      </View>
    )
  }
}
const mapStateToProps = state => ({
  favorite: state.favorite,
})
const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (storeName) => dispatch(actions.onLoadFavoriteData(storeName)),
})
// connect只是一个function,并不一定非要放在export后面
const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
    tabStyle:{
      // minWidth:50,
        padding: 0,
    },
    indicatorStyle:{
      height: 2,
      backgroundColor:'white',
    },
    labelStyle:{
      fontSize:13,
        margin: 0,
        // marginTop: 6,
        // marginBottom: 6
    }
})
