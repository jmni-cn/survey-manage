import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { getThemeOverrides, getGenerateColors } from './helper'
import { darkTheme } from 'naive-ui'

import { useColorMode, useCycleList, type BasicColorSchema } from '@vueuse/core'
export const themeConfigs = {
  primary: '#f2aa00',
  info: '#2080f0',
  success: '#18a058',
  warning: '#faad14',
  error: '#d03050'
}

export const useThemeStore = defineStore('theme', () => {

  /** 默认模式，一般设置为auto跟随系统 */
  const defaultMode = ref<BasicColorSchema>('dark')
  /** 模式列表 */
  const modeList = ref<BasicColorSchema[]>(['dark', 'light', 'auto'])

  const colorMode = useColorMode({
    initialValue: defaultMode.value,
    emitAuto: true
  })
  const { state, next } = useCycleList(modeList, {
    initialValue: colorMode
  })
  watch(
    state,
    () => {
      if (!modeList.value.includes(state.value)) {
        // 如果不在modeList里面，就设置成默认的
        state.value = defaultMode.value
      }
      colorMode.value = state.value as BasicColorSchema
    },
    { immediate: true }
  )

  /** 暗黑模式 */
  const darkMode = computed(() => {
    const { system, store } = colorMode
    if (state.value === 'auto') {
      return system.value === 'dark'
    }
    return store.value === 'dark'
  })

  /** 主题配置 */
  const themeConfig = ref<NTheme.Config>(themeConfigs)

  /** 主题 */
  const theme = computed(() => (darkMode.value ? darkTheme : null))

  /** 主题theme-overrides */
  const themeOverrides = computed(() => {
    return getThemeOverrides(themeConfig.value, darkMode.value)
  })

  /** 主题颜色 */
  const themeColors = computed(() => {
    const entries = Object.entries(themeConfig.value) as [
      NTheme.ColorType,
      string
    ][]
    const colors = {} as Record<NTheme.ColorType, string[]>
    entries.forEach(([key, value]) => {
      colors[key] = getGenerateColors(value, darkMode.value)
    })
    console.log(colors);
    return colors
  })

  /** 暗黑模式切换 */
  function toggleDarkMode() {
    next()
  }

  /** 手动设置主题 */
  function setThemeConfig(config: NTheme.Config) {
    themeConfig.value = {
      ...themeConfig.value,
      ...config
    }
  }
  return {
    darkMode,
    themeConfig,
    theme,
    themeOverrides,
    themeColors,
    modeState: state,
    toggleDarkMode,
    setThemeConfig
  }
})
