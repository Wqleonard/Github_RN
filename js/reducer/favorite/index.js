import Types from '../../action/types'

const defaultState = {}
/**
 * favorite:{
 *     popular:{
 *         projectModels:[],
 *         isLoading:false
 *     },
 *      popular:{
 *         projectModels:[],
 *         isLoading:false
 *     },
 * }
 * 如何动态的设置store和动态获取store（难点：store key不固定）
 * @param state 树，横向扩展
 * @param action
 * @returns {{theme: (onAction|*|theme|{activeTintColor, updateTime}|string)}}
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.FAVORITE_LOAD_DATA:// 获取数据
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
        },
      }
    case Types.FAVORITE_LOAD_SUCCESS:// 下拉刷新成功
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
          projectModels: action.projectModels,
        },
      }
    case Types.FAVORITE_LOAD_FAIL:// 下拉刷新失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
        },
      }
    default:
      return state
  }
}