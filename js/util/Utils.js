
export default class Utils {
  /**
     * 检查item是否被收藏
     * @param item 当前item
     * @param keys 所有被收藏项目的keys集合
     * @returns {boolean}
     */
  static checkFavorite(item, keys = []) {
    if (!keys) return false
    const id = item.id ? item.id : item.fullName
    if (keys.indexOf(id.toString()) !== -1) {
      return true
    }
    return false
  }
}