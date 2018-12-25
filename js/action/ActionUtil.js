// 第一次加载数据时调用的
import ProjectModel from '../model/ProjectModel'
import Utils from '../util/Utils'

export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao) {
  let fixItems = []
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items
    }
  }
  // 第一次要展示的数据
  const showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize)
  _projectModels(showItems, favoriteDao, (projectModels) => {
    dispatch({
      type: actionType,
      items: fixItems, // 全部数据
      projectModels,
      storeName,
      pageIndex: 1,
    })
  })
}

/**
 * 通过本地的收藏状态包装Item
 * @param showItems
 * @param favoriteDao
 * @param callback
 * @returns {Promise<void>}
 * @private
 */
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = []
  try {
    // 获取收藏的key
    keys = await favoriteDao.getFavoriteKeys()
  } catch (e) {
    console.log(e)
  }
  const projectModels = []
  for (const item of showItems) {
    projectModels.push(new ProjectModel(item, Utils.checkFavorite(item, keys)))
  }
  if (typeof callback === 'function') {
    callback(projectModels)
  }
}
