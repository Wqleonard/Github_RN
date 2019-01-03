/**
 * 数组工具类
 */
export default class ArrayUtil {
  /**
   * 两个数组是否相等
   * @param arr1
   * @param arr2
   * @returns {boolean}
   */
  static isEqual(arr1, arr2) {
    if (!(arr1 && arr2)) return false
    if (arr1.length !== arr2.length) return false
    for (let i = 0, l = arr1.length; i < l; i++) {
      if (arr1[i] !== arr2[i]) return false
    }
    return true
  }


  /**
   * 如果item存在则从数组删除，不存在则将其添加到数组
   * @param array
   * @param item
   */
  static updateArray(array, item) {
    for (let i = 0, len = array.length; i < len; i++) {
      if (array[i] === item) {
        array.splice(i, 1)
        return
      }
    }
    array.push(item)
  }

  /**
   * 将数组中指定元素移除
   * @param array
   * @param item  要移除的item
   * @param id 要对比的属性，缺省则比较地址
   * @returns {*}
   */
  static remove(array, item, id) {
    if (!array) return
    for (let i = 0, l = array.length; i < l; i++) {
      const val = array[i]
      if (item === val || (val && val[id] && val[id] === item[id])) {
        array.splice(i, 1)
      }
    }
    return array
  }
}