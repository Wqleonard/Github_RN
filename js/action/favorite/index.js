import Types from '../types'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import ProjectModel from '../../model/ProjectModel'

/**
 * 加载收藏的项目
 * @param flag 标识
 * @param isShowLoading 是否显示loading
 * @returns {Function}
 */
export function onLoadFavoriteData(flag, isShowLoading) {
  return (dispatch) => {
    if (isShowLoading) {
      dispatch({
        type: Types.FAVORITE_LOAD_DATA,
        storeName: flag,
      })
    }
    new FavoriteDao(flag).getAllItems()
      .then((items) => {
        const resultData = []
        for (const item of items) {
          resultData.push(new ProjectModel(item, true))
        }
        dispatch({
          type: Types.FAVORITE_LOAD_SUCCESS,
          projectModels: resultData,
          storeName: flag,
        })
      })
      .catch((error) => {
        console.log(error)
        dispatch({
          type: Types.FAVORITE_LOAD_FAIL,
          error,
          storeName: flag,
        })
      })
  }
}