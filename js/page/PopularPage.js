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
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import GlobalStyles from "../res/styles/GlobalStyles";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";
const favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_popular)
const URL = 'https://api.github.com/search/repositories?&q='
const QUERY_STR = '&sort=stars'
type Props = {};
const THEME_COLOR = '#678'
class PopularPage extends Component<Props> {
  constructor(props) {
    super(props)
    const {onLoadLanguage}=this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_key)
  }

  // componentWillReceiveProps(nextProps): void {
  //     if(nextProps){
  //      const b=  nextProps.navigation.getParam('aaa')
  //     }
  // }

    _getTabs() {
    const tabs = {}
    this.preKeys=this.props.keys
        this.preKeys.forEach((item, index) => {
        if(item.checked){
            tabs[`tab${index}`] = {
                screen: props => <PopularTabPage {...props} tabLabel={item.name} />,
                navigationOptions: {
                    title: item.name,
                },
            }
        }
    })
    return tabs
  }

  _tabNav(){
      if(!this.tabNav || !ArrayUtil.isEqual(this.preKeys,this.props.keys)) {
          this.tabs = this._getTabs()
              this.tabNav =  Object.keys(this.tabs).length?createAppContainer(createMaterialTopTabNavigator(
                  this.tabs, {
                      tabBarOptions: {
                          tabStyle: styles.tabStyle,
                          upperCaseLabel: false, // 是否标签大写，默认为true大写
                          scrollEnabled: true, // 是否支持滚动，默认为false不滚动 android上会出问题，在style里设置一个高度
                          style: {
                              backgroundColor: THEME_COLOR, // tabBar背景色
                              height: 30,//fix 开启scrollEnabled后在android上初次加载闪烁的问题
                          },
                          indicatorStyle: styles.indicatorStyle,//标签指示器的样式 横线
                          labelStyle: styles.labelStyle, // 文字的样式
                      },
                      lazy:true
                  }
              )):null
      }
      return this.tabNav
  }

    render() {
        let statusBar={
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        }
        let navigationBar=
            <NavigationBar
                title='最热'
                statusBar={statusBar}
                style={{backgroundColor:THEME_COLOR,paddingTop: DeviceInfo.isIPhoneX_deprecated?30:0}}
            />
    const TabNavigator=this._tabNav()
    return (
      <View
        style={{ flex: 1 }}
      >
          {navigationBar}
          {TabNavigator && <TabNavigator />}
      </View>
    )
  }
}
const mapPopularStateToProps=state=>({
    keys:state.language.keys
})
const mapPopularDispatchToProps=dispatch=>({
    onLoadLanguage: flag=>dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapPopularStateToProps,mapPopularDispatchToProps)(PopularPage)
const pageSize = 10 // 设置常量


class PopularTab extends Component<Props> {
  constructor(props) {
    super(props)
    const { tabLabel } = this.props
    this.storeName = tabLabel
    this.isFacoriteChanged=false
  }

  componentDidMount(): void {
    this.loadData()
      EventBus.getInstance().addListener(EventTypes.favorite_changed_popular,this.favoriteChangedListener=()=>{
          this.isFacoriteChanged=true
      })
      EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.bottomTabSelectListener=data=>{
          if(data.to===0&&this.isFacoriteChanged){
              this.loadData(false,true)
          }
      })
  }

  componentWillUnmount(): void {
      EventBus.getInstance().removeListener(this.favoriteChangedListener)
      EventBus.getInstance().removeListener(this.bottomTabSelectListener)
  }

    _store() {
    const { popular } = this.props
    let store = popular[this.storeName]// 动态获取state
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 要展示的数据
        hideLoadingMore: true, // 默认隐藏加载更多
      }
    }
    return store
  }

  getFetchUrl(key) {
    return URL + key + QUERY_STR
  }

  getIndicator() {
    return this._store().hideLoadingMore ? null
      : (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator
            style={styles.indicator}
          />
          <Text>正在加载更多</Text>
        </View>
      )
  }

  loadData(loadMore,refreshFavorite) {
    const { onRefreshPopular, onLoadMorePopular,onFlushPopularFavorite } = this.props
    const store = this._store()
    const url = this.getFetchUrl(this.storeName)
    if (loadMore) {
        onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (callback) => {
            this.refs.toast.show('没有更多了')
        })
    } else if(refreshFavorite){
      //若直接调用刷新dispatch则会回到第一页，仍定位在当前页，不请求下一页，也不显示加载更多菊花
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
    } else {
      onRefreshPopular(this.storeName, url, pageSize,favoriteDao)
    }
  }

  renderItem({ item }) {
    return (
      <PopularItem
        projectModel={item}
        onSelect={(callback) => {
            NavigationUtil.goPage({
              projectModel:item,
              flag:FLAG_STORAGE.flag_popular,
              callback,
            },'DetailPage')
        }}
        onFavorite={(item,isFavorite)=>{
            FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_popular)
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
          keyExtractor={item => `popular${item.item.id}`}
          refreshControl={(
            <RefreshControl
              title='Loading...'
              titleColor={THEME_COLOR}
              tintColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => {
                this.loadData()
              }}
            />
)}
          ListFooterComponent={() => this.getIndicator()}
          onEndReached={() => {
            console.log('--onEndReached--')
            // 防止极端情况下onEndReached比onMomentumScrollBegin先执行了
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true)
                this.canLoadMore = false
              }
            }, 100)
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            console.log('--onMomentumScrollBegin--')
            // onEndReached会触发两次，此处给一个标志位，当滚动的时候才触发
            this.canLoadMore = true
          }}
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
  popular: state.popular,
})
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize,favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize,favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items,favoriteDao, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items,favoriteDao, callback)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items,favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items,favoriteDao)),
})
// connect只是一个function,并不一定非要放在export后面
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)
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
