import Types from '../types'
import ThemeDao from '../../expand/dao/ThemeDao'

/**
 * 主题变更
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onThemeChange(theme) {
  return { type: Types.THEME_CHANGE, theme }
}

/**
 * 初始化主题
 * @returns {{theme: *, type: string}}
 */
export function onThemeInit() {
  return (dispatch) => {
    new ThemeDao().getTheme().then((data) => {
      dispatch(onThemeChange(data))
    })
  }
}

export function onShowCustomThemeView(show) {
  return { type: Types.SHOW_THEME_VIEW, customThemeViewVisible: show() }
}