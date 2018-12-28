import Types from '../types'
import LanguageDao from '../../expand/dao/LanguageDao'


/**
 * 加载收藏的项目
 * @param flag 标识
 * @param isShowLoading 是否显示loading
 * @returns {Function}
 */
export function onLoadLanguage(flagKey) {
  return async (dispatch) => {
    try {
      const languages = await new LanguageDao(flagKey).fetch()
      dispatch({
        type: Types.LANGUAGE_LOAD_SUCCESS,
        languages,
        flag: flagKey,
      })
    } catch (e) {
      console.log(e)
    }
  }
}