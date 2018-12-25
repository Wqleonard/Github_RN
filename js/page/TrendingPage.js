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
import PopularItem from "../common/PopularItem";
import FavoriteDao from "../expand/dao/FavoriteDao";
const favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_trending)
const URL = 'https://github.com/trending/'
// const QUERY_STR = '&sort=stars'
type Props = {};
const THEME_COLOR = '#678'
const EVENT_TYPE_TIME_SPAN_CHANGE='EVENT_TYPE_TIME_SPAN_CHANGE'
export default class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.tabNames = ['All', 'C', 'C#', 'PHP', 'JavaScript']
        this.state={
            timeSpan:TimeSpans[0]
        }
        this._tabNav()
    }

    _getTabs() {
        const tabs = {}
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item} />,
                navigationOptions: {
                    title: item,
                },
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
       //优化效率：根据需要选择是否重新创建TabNavigator,通常tab改变后才重新创建
       this.tabNav = createAppContainer(createMaterialTopTabNavigator(
           this._getTabs(), {
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
           }
       ))
   }
    render() {
        let statusBar={
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        }
        let navigationBar=
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={statusBar}
                style={{backgroundColor:THEME_COLOR}}
            />

        return (
            <View
                style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated?30:0 }}
            >
                {navigationBar}
                <this.tabNav />
                {this.renderTrendingDialog()}
            </View>
        )
    }
}
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
        this.timeSpanChangeListener=DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE,(timeSpan)=>{
           this.timeSpan=timeSpan
            this.loadData()
        })
    }

   componentWillUnmount(): void {
        this.timeSpanChangeListener && this.timeSpanChangeListener.remove()
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

    loadData(loadMore) {
        const {onRefreshTrending, onLoadMoreTrending } = this.props
        const store = this._store()
        const url = this.getFetchUrl(this.storeName)
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items,favoriteDao, (callback) => {
                this.refs.toast.show('没有更多了')
            })
        } else {
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
            <View style={styles.container}>
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
