import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore'
import { _projectModels, handleData } from '../ActionUtil'
/**
 * 获取最热数据的异步action
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
  return (dispatch) => {
    dispatch({ type: Types.TRENDING_REFRESH, storeName })
    const dataStore = new DataStore()
    dataStore.fetchData(url, FLAG_STORAGE.flag_trending) // 异步action与数据流
      .then((data) => {
        handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
      })
      .catch((error) => {
        console.log(error.toString())
        dispatch({
          type: Types.POPULAR_REFRESH_FAIL,
          storeName,
          error,
        })
      })
  }
}

/**
 *
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callback  回调函数，向调用页面通信，比如异常信息展示，加载完成等
 */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
  return (dispatch) => {
    setTimeout(() => {
      // 模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        // 已加载完全部数据
        if (typeof callback === 'function') {
          callback('no more')
        }
        dispatch({
          type: Types.TRENDING_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex,
          // projectModels: dataArray,
        })
      } else {
        const max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
        _projectModels(dataArray.slice(0, max), favoriteDao, (projectModels) => {
          dispatch({
            type: Types.TRENDING_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels,
          })
        })
      }
    }, 500)
  }
}

export function onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
  return (dispatch) => {
    const max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
    _projectModels(dataArray.slice(0, max), favoriteDao, (projectModels) => {
      dispatch({
        type: Types.FLUSH_TRENDING_FAVORITE,
        storeName,
        // pageIndex,
        projectModels,
      })
    })
  }
}
// // 第一次加载数据时调用的
// function handleData(dispatch, storeName, data, pageSize) {
//   let fixItems = []
//   if (data && data.data && data.data.items) {
//     fixItems = data.data.items
//   }
//   dispatch({
//     type: Types.POPULAR_REFRESH_SUCCESS,
//     items: fixItems, // 全部数据
//     projectModels: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize), // 第一次要展示的数据
//     storeName,
//     pageIndex: 1,
//   })
// }