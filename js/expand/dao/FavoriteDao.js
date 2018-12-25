import { AsyncStorage } from 'react-native'

const FAVORITE_KEY_PREFIX = 'favorite_'
export default class FavoriteDao {
  constructor(flag) {
    this.facoriteKey = FAVORITE_KEY_PREFIX + flag
  }

  /**
     * 收藏项目，保存收藏的项目
     * @param key 项目id
     * @param value  收藏的项目
     * @param callback
     */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error) => {
      if (!error) {
        this.updateFavoriteKeys(key, true)
      }
    })
  }

  /**
     * 取消收藏，移除已经收藏的项目
     * @param key
     */
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error) => {
      if (!error) {
        this.updateFavoriteKeys(key, false)
      }
    })
  }

  /**
     *更新Favrite key集合
     * @param key
     * @param isAdd true 添加 false 删除
     */
  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.facoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = []
        if (result) {
          favoriteKeys = JSON.parse(result)
        }
        const index = favoriteKeys.indexOf(key)
        if (isAdd) {
          // 如果是添加且key不存在则push进
          if (index === -1) favoriteKeys.push(key)
        } else if (index !== -1) {
          favoriteKeys.splice(index, 1) // 如果是删除且key存在则slice
        }
        AsyncStorage.setItem(this.facoriteKey, JSON.stringify(favoriteKeys))// 将更新结果保存
      }
    })
  }

  /**
     * 获取收藏的Repository对应的key
     * @returns {Promise<any> | Promise<*>}
     */
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.facoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
          }
        } else {
          reject(error)
        }
      })
    })
  }

  /**
     * 获取收藏模块当前列表（最热 or 趋势）所有收藏的项目
     * @returns {Promise<any> | Promise<*>}
     */
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys().then((keys) => {
        const items = []
        if (keys) {
          AsyncStorage.multiGet(keys, (error, stores) => {
            if (!error) {
              try {
                for (const item of stores) {
                  if (item[1]) items.push(item[1])
                }
                resolve(items)
              } catch (e) {
                reject(e)
              }
            } else {
              reject(error)
            }
          })
        } else {
          resolve(items)
        }
      })
        .catch((error) => {
          reject(error)
        })
    })
  }
}