/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */
import React, { Component } from 'react'
import {
  createBottomTabNavigator,
  createAppContainer,
} from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { BottomTabBar } from 'react-navigation-tabs'
import { connect } from 'react-redux'
import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'
// import NavigationUtil from "./NavigationUtil";
type Props = {};
const TABS = {
  // 在这里配置路由界面
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      //tabBar点击事件  可以通过重写此方法传递参数而达到刷新页面的目的（会走进PopularPage的componentWillReceiveProps方法）
      // tabBarOnPress:(props)=>{
        // props.navigation.navigate('PopularPage',{'aaa':123})
      // },
      tabBarLabel: '最热',
      tabBarIcon: ({ tintColor, focused }) => (
        <MaterialIcons
          name='whatshot'
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name='md-trending-up'
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({ tintColor, focused }) => (
        <MaterialIcons
          name='favorite'
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({ tintColor, focused }) => (
        <Entypo
          name='user'
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
}

class DynamicTabNavigator extends Component<Props> {
  constructor(props) {
    super(props)
    console.disableYellowBox = true
  }

  _tabNavigator() {
    if (!this.tabs) {
      const {
        PopularPage, TrendingPage, FavoritePage, MyPage,
      } = TABS
      const tabs = {
        PopularPage, TrendingPage, FavoritePage, MyPage,
      }// 根据需要定制显示的tabs
      // PopularPage.navigationOptions.tabBarLabel='最新' 动态修改tab的属性
      this.tabs = createAppContainer(createBottomTabNavigator(tabs, {
        tabBarComponent: props => <TabBarComponent theme={this.props.theme} {...props} />,
      }))
    }
    return this.tabs
  }

  render() {
    const Tab = this._tabNavigator()
    return (
        <Tab
            onNavigationStateChange={(preState,newState,action)=>{
                EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select,{//发送底部tab切换的事件
                    from:preState.index,
                    to:newState.index
                })
            }}
        />
    )
  }
}

class TabBarComponent extends React.Component {
  constructor(props) {
    super(props)
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime(),
    }
  }

  render() {
    // const {routes,index}=this.props.navigation.state
    //      // if(routes[index].params){
    //      //   const {theme}=routes[index].params
    //      //   //以最新的更新时间为主，防止被其它tab之前的修改覆盖掉
    //      //   if(theme && theme.updateTime>this.theme.updateTime){
    //      //     this.theme=theme
    //      //   }
    //      // }
    return (
      <BottomTabBar
        {...this.props}
             // inactiveTintColor={this.theme.inactiveTintColor || this.props.inactiveTintColor}
        activeTintColor={this.props.theme || this.props.activeTintColor}
      />
    )
  }
}
// state.theme是指theme reducer，还有其他reducer，再.theme拿到theme值
const mapStateToProps = state => ({
  theme: state.theme.theme,
})
export default connect(mapStateToProps)(DynamicTabNavigator)
