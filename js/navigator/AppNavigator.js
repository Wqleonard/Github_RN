import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
    createAppContainer
} from 'react-navigation'
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
const InitNavigator=createStackNavigator({
    WelcomePage:{
        screen:WelcomePage,
        navigationOptions:{
            header:null //通过null禁用StackNavigator的navigationBar
        }
    }
})

const MainNavigator=createStackNavigator({
    HomePage:{
        screen:HomePage,
        navigationOptions:{
            header:null
        }
    },
    DetailPage:{
        screen:DetailPage,
        navigationOptions:{
            // header:null
        }
    }
})

export default createAppContainer(createSwitchNavigator({
    Init:InitNavigator,
    Main:MainNavigator,
}, {
      defaultNavigationOptions:{
        header:null
      }
   }
))