import {
  createStackNavigator,
  // createMaterialTopTabNavigator,
  // createBottomTabNavigator,
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation'
import { connect } from 'react-redux'
import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers'
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import WebViewPage from '../page/WebViewPage'
import AboutPage from '../page/about/AboutPage'
import AboutMePage from '../page/about/AboutMePage'
import CustomKeyPage from '../page/CustomKeyPage'
import SortKeyPage from "../page/SortKeyPage";
// import AsyncStorageDemoPage from '../page/AsyncStorageDemoPage'
// import DataStoreDemoPage from '../page/DataStoreDemoPage'

export const rootCom = 'Init'
const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null, // 通过null禁用StackNavigator的navigationBar
    },
  },
})

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null,
    },
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      header: null,
    },
  },
  WebViewPage: {
    screen: WebViewPage,
    navigationOptions: {
      header: null,
    },
  },
  AboutPage: {
    screen: AboutPage,
    navigationOptions: {
      header: null,
    },
  },
  AboutMePage: {
    screen: AboutMePage,
    navigationOptions: {
      header: null,
    },
  },
  CustomKeyPage: {
    screen: CustomKeyPage,
    navigationOptions: {
      header: null,
    },
  },
  SortKeyPage: {
    screen: SortKeyPage,
    navigationOptions: {
      header: null,
    },
  },
})

export const RootNavigator = createAppContainer(createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator,
}, {
  defaultNavigationOptions: {
    header: null,
  },
}))
// nav是react-navigation里的一个属性
export const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
)

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root')
const mapStateProps = state => ({
  state: state.nav, // v2
})
export default connect(mapStateProps)(AppWithNavigationState)