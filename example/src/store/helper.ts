import { generate } from '@ant-design/colors'
import { capitalize } from 'jmni'
import { type GlobalThemeOverrides, commonDark, commonLight } from 'naive-ui'

/** 颜色类型 */
type ColorType = 'primary' | 'info' | 'success' | 'warning' | 'error'
/** 颜色类型大写值 */
type ColorTypeCase = 'Primary' | 'Info' | 'Success' | 'Warning' | 'Error'
/** 颜色场景 */
type ColorScene = '' | 'suppl' | 'hover' | 'pressed'
/** 颜色场景大写值 */
type ColorSceneCase = '' | 'Suppl' | 'Hover' | 'Pressed'
/** 按钮颜色场景 */
type ButtonColorScene = '' | 'hover' | 'pressed' | 'focus' | 'disabled'
/** 按钮颜色场景大写值 */
type ButtonColorSceneCase = '' | 'Hover' | 'Pressed' | 'Focus' | 'Disabled'
// 主题配置
type Config = {
  [key in ColorType]: string
}

type ColorKey = `${ColorType}Color${ColorSceneCase}`
type ButtonColorKey =
  `textColor${ButtonColorSceneCase}${ColorTypeCase}`
type ThemeColor = Partial<Record<ColorKey, string>>

interface ColorAction {
  scene: ColorSceneCase
  handler: (color: string) => string
}

/**
 * 根据颜色获取色系
 *
 * @param {string} color #1890ff
 * @param {boolean} darkMode 暗黑模式
 * @return {string[]} ['#E6F7FF', '#BAE7FF', '#91D5FF', ''#69C0FF', '#40A9FF', '#1890FF', '#096DD9', '#0050B3', '#003A8C', '#002766']
 */
export function getGenerateColors(color: string, darkMode: boolean = false): string[] {
  return darkMode
    ? generate(color, {
        theme: 'dark',
        backgroundColor: commonDark.bodyColor
      })
    : generate(color)
}

/**
 * 获取其他组件颜色，主要用于适配暗色下文字颜色，该方法可以按需取舍
 *
 * @desc 比如暗黑模式下Primary按钮文字、Checkbox勾号默认都是黑色的，所以需要特殊处理变成白色,可能会有遗漏，需要的话按需补充
 * @param {Config} config store themeConfig
 * @param {boolean} darkMode 暗黑模式
 * @return {GlobalThemeOverrides}
 */
function getOtherColor(
  config: Config,
  darkMode: boolean
): GlobalThemeOverrides {
  
  const otherColor: GlobalThemeOverrides = {
    Button: {},
    Checkbox: {
      checkMarkColor: getTextColor(darkMode)
    },
    DatePicker: {
      itemTextColorActive: getTextColor(darkMode)
    },
    Calendar: {
      dateTextColorCurrent: getTextColor(darkMode)
    },
    Switch: {
      buttonColor: getTextColor(darkMode)
    }
  }
  const keys = Object.keys(config) as ColorType[]
  const scenes: ButtonColorSceneCase[] = [
    '',
    'Hover',
    'Pressed',
    'Focus',
    'Disabled'
  ]
  keys.forEach((key) => {
    scenes.forEach((scene) => {
      const colorKey = `textColor${scene}${capitalize(key)}` as ButtonColorKey
      otherColor.Button![colorKey] = getTextColor(darkMode)
    })
  })
  return otherColor
}

/**
 * 获取主题颜色
 *
 * @param {Config} config store themeConfig
 * @param {boolean} darkMode 暗黑模式
 * @return {ThemeColor}
 */
export function getThemeColors(
  config: Config,
  darkMode: boolean
): ThemeColor {
  const themeColor: ThemeColor = {}
  const keys = Object.keys(config) as ColorType[]
  
  const colorActions: ColorAction[] = [
    { scene: '', handler: (color) => getGenerateColors(color, darkMode)[5] },
    {
      scene: 'Hover',
      handler: (color) => getGenerateColors(color, darkMode)[4]
    },
    {
      scene: 'Suppl',
      handler: (color) => getGenerateColors(color, darkMode)[4]
    },
    {
      scene: 'Pressed',
      handler: (color) => getGenerateColors(color, darkMode)[6]
    }
  ]
  keys.forEach((key) => {
    colorActions.forEach((action) => {
      const color = action.handler(config[key]!)
      const colorKey = `${key}Color${action.scene}` as ColorKey
      themeColor[colorKey] = color
    })
  })
  return themeColor
}

/**
 * 获取文字颜色，主要用于适配暗黑模式文字颜色
 *
 * @param {boolean} darkMode 暗黑模式
 * @return {string}
 */
function getTextColor(darkMode: boolean): string {
  return darkMode ? commonDark.textColor2 : commonLight.baseColor
}

/**
 * 获取动态主题ThemeOverrides
 *
 * @param {Config} config store themeConfig
 * @param {boolean} darkMode 暗黑模式
 * @return {GlobalThemeOverrides}
 */
export function getThemeOverrides(
  config: Config,
  darkMode: boolean = false
): GlobalThemeOverrides {
  const themeColors = getThemeColors(config, darkMode)
  return {
    common: {
      // ...themeColors,
      ...getCommonTheme(themeColors, darkMode),
    },
    ...getOtherColor(config, darkMode)
  }
}

export const getCommonTheme = (themeColors:any, darkMode: boolean = false) => {
  const _common = darkMode ? commonDark : commonLight
  return Object.assign({}, _common, themeColors)
}

