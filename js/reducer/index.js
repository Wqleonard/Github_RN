import { combineReducers } from 'redux'
import theme from './theme'
import popular from './popular'
import trending from './trending'
import favorite from './favorite'
import language from './language'
import { rootCom, RootNavigator } from '../navigator/AppNavigators'

// 1.指定默认的state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom))

// 2.创建自己的navigation reducer
const navReducer = (state = navState, action) => {
  const nextState = RootNavigator.router.getStateForAction(action, state)
  // 如果 nextState为null或未定义 只需返回原始的state
  return nextState || state
}

// 3.合并reducer
const index = combineReducers({
  nav: navReducer,
  theme,
  popular,
  trending,
  favorite,
  language,
})

export default index