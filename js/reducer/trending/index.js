import Types from '../../action/types'

const defaultState = {}
/**
 * popular:{
 *     java:{
 *         items:[],
 *         isLoading:false
 *     },
 *     ...
 * }
 * 如何动态的设置store和动态获取store（难点：store key不固定）
 * @param state 树，横向扩展
 * @param action
 * @returns {{theme: (onAction|*|theme|{activeTintColor, updateTime}|string)}}
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.TRENDING_REFRESH_SUCCESS:// 下拉刷新成功
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items, // 全部数据 用来上拉加载更多
          projectModels: action.projectModels, // 用来展示的数据，第一页
          isLoading: false,
          pageIndex: action.pageIndex,
          hideLoadingMore: false, // 成功之后可以显示了，一直进行上拉加载更多操作则一直显示菊花
        },
      }
    case Types.TRENDING_REFRESH:// 下拉刷新
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true, // 触发下拉刷新时隐藏加载更多菊花
        },
      }
    case Types.TRENDING_REFRESH_FAIL:// 下拉刷新失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
          // hideLoadingMore:true,
        },
      }
    case Types.TRENDING_LOAD_MORE_SUCCESS:// 上拉加载更多成功
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          hideLoadingMore: false, // 一直进行上拉加载更多操作则一直显示菊花
          pageIndex: action.pageIndex,
        },
      }
    case Types.TRENDING_LOAD_MORE_FAIL:// 上拉加载更多失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex,
        },
      }
    default:
      return state
  }
}