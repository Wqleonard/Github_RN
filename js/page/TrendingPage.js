/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
    StyleSheet, ActivityIndicator,TouchableOpacity,
    Text, View, FlatList, RefreshControl, DeviceInfo,
    DeviceEventEmitter,//事件监听器
} from 'react-native'
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import { connect } from 'react-redux'
import Toast from 'react-native-easy-toast'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import actions from '../action/index'
// import DetailPage from './DetailPage'
// import NavigationBar from '../common/NavigationBar'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from "../common/NavigationBar";
import TrendingDialog,{TimeSpans} from '../common/TrendingDialog'
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteUtil from "../util/FavoriteUtil";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteDao from "../expand/dao/FavoriteDao";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import GlobalStyles from "../res/styles/GlobalStyles";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";
const favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_trending)
const URL = 'https://github.com/trending/'
// const QUERY_STR = '&sort=stars'
type Props = {};
const THEME_COLOR = '#678'
const EVENT_TYPE_TIME_SPAN_CHANGE='EVENT_TYPE_TIME_SPAN_CHANGE'
class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props)
        // this.tabNames = ['All', 'C', 'C#', 'PHP', 'JavaScript']
        this.state={
            timeSpan:TimeSpans[0]
        }
        const {onLoadLanguage}=this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_language)
    }

    _getTabs() {
        const tabs = {}
        this.preLanguages=this.props.languages
        this.preLanguages.forEach((item, index) => {
            if(item.checked){
                tabs[`tab${index}`] = {
                    screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} />,
                    navigationOptions: {
                        title: item.name,
                    },
                }
            }
        })
        return tabs
    }

    renderTitleView(){
       return(
           <View>
             <TouchableOpacity
                 underlayColor='transparent'
                 onPress={()=>{
                     this.dialog.show()
                 }}
             >
               <View style={{flexDirection: 'row',alignItems:'center'}}>
                  <Text style={{fontSize: 18,color:'#FFFFFF',fontWeight: '400'}}>
                      趋势 {this.state.timeSpan.showText}
                  </Text>
                   <MaterialIcons
                     name={'arrow-drop-down'}
                     size={22}
                     style={{color:'white'}}
                   />
               </View>
             </TouchableOpacity>
           </View>
       )
    }

    onSelectTimeSpan(tab){
        this.dialog.dismiss()
        this.setState({
            timeSpan:tab
        })
        //tabNavigator不会重新加载，通过发送通知的方式来刷新tab下的列表
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE,tab)
    }

    renderTrendingDialog(){
        return(
            <TrendingDialog
             ref={dialog=>this.dialog=dialog}
             onSelect={(tab)=>{
                 this.onSelectTimeSpan.bind(this)(tab)
             }}
            />
        )
    }

   _tabNav(){
      if(!this.tabNav || !ArrayUtil.isEqual(this.preLanguages,this.props.languages)){
          //优化效率：根据需要选择是否重新创建TabNavigator,通常tab改变后才重新创建
          this.tabs=this._getTabs()
              this.tabNav =Object.keys(this.tabs).length? createAppContainer(createMaterialTopTabNavigator(
                  this.tabs, {
                      tabBarOptions: {
                          tabStyle: styles.tabStyle,
                          upperCaseLabel: false, // 是否标签大写，默认为true大写
                          scrollEnabled: true, // 是否支持滚动，默认为false不滚动 android上会出问题，在style里设置一个高度
                          style: {
                              backgroundColor: '#678', // tabBar背景色
                              height: 30,//fix 开启scrollEnabled后在android上初次加载闪烁的问题
                          },
                          // indicatorStyle:styles.indicatorStyle,//标签指示器的样式 横线
                          labelStyle: styles.labelStyle, // 文字的样式
                      },
                      lazy:true
                  }
              )):null
      }
      return this.tabNav
   }

    render() {
        const statusBar={
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        }
        const navigationBar=
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={statusBar}
                style={{backgroundColor:THEME_COLOR, paddingTop: DeviceInfo.isIPhoneX_deprecated?30:0}}
            />
        const TabNavigator=this._tabNav()
        return (
            <View
                style={{ flex: 1 }}
            >
                {navigationBar}
                {TabNavigator && <TabNavigator />}
                {this.renderTrendingDialog()}
            </View>
        )
    }
}

const mapTrendingStateToProps=state=>({
    languages:state.language.languages
})
const mapTrendingDispatchToProps=dispatch=>({
    onLoadLanguage: flag=>dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapTrendingStateToProps,mapTrendingDispatchToProps)(TrendingPage)



const pageSize = 10 // 设置常量
class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props)
        const { tabLabel,timeSpan } = this.props
        this.storeName = tabLabel
        this.timeSpan=timeSpan
    }

    componentDidMount(): void {
        this.loadData()
        EventBus.getInstance().addListener(EventTypes.favorite_changed_trending,this.favoriteChangedListener=()=>{
            this.isFacoriteChanged=true
        })
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.bottomTabSelectListener=data=>{
            if(data.to===1&&this.isFacoriteChanged){
                this.loadData(false,true)
            }
        })
        this.timeSpanChangeListener=DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE,(timeSpan)=>{
           this.timeSpan=timeSpan
            this.loadData()
        })
    }

   componentWillUnmount(): void {
       this.timeSpanChangeListener && this.timeSpanChangeListener.remove()
       EventBus.getInstance().removeListener(this.favoriteChangedListener)
       EventBus.getInstance().removeListener(this.bottomTabSelectListener)
   }

    _store() {
        const { trending } = this.props
        let store = trending[this.storeName]// 动态获取state
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
        return URL + key + '?'+this.timeSpan.searchText
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

    loadData(loadMore, refreshFavorite) {
        const {onRefreshTrending, onLoadMoreTrending,onFlushTrendingFavorite } = this.props
        const store = this._store()
        const url = this.getFetchUrl(this.storeName)
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items,favoriteDao, (callback) => {
                this.refs.toast.show('没有更多了')
            })
        } else if(refreshFavorite){
            //若直接调用刷新dispatch则会回到第一页，仍定位在当前页，不请求下一页，也不显示加载更多菊花
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        }else {
            onRefreshTrending(this.storeName, url, pageSize,favoriteDao)
        }
    }

    renderItem({ item }) {
        return (
            <TrendingItem
                projectModel={item}
                onSelect={(callback) => {
                    NavigationUtil.goPage({
                        projectModel:item,
                        flag:FLAG_STORAGE.flag_trending,
                        callback,
                    },'DetailPage')
                }}
                onFavorite={(item,isFavorite)=>{
                    FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_trending)
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
                    keyExtractor={item => `trending${item.item.id||item.item.fullName}`}
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
    trending: state.trending,
})
const mapDispatchToProps = dispatch => ({
    onRefreshTrending: (storeName, url, pageSize,favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize,favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items,favoriteDao, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items,favoriteDao, callback)),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items,favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items,favoriteDao)),
})
// connect只是一个function,并不一定非要放在export后面
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)
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
    }
})
