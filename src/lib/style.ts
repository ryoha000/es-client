import {
  Theme,
  ThemeVariables,
  TransparentThemeVariables,
  CSSCommonVariables
} from '../types/theme'
import { computed } from '@vue/composition-api'
import * as CSS from 'csstype'

/** テーマに依存しない色 */
export const commonStyles = {
  text: {
    whitePrimary: '#ffffff' as const,
    whiteSecondary: 'rgba(255, 255, 255, 0.5)' as const,
    black: '#222222' as const
  },
  ui: {
    qall: '#00ACA2' as const,
    muted: '#F26451' as const,
    pin: '#f2ba4a' as const
  },
  background: {
    overlay: 'rgba(25, 26, 29, 0.5)' as const,
    black: '#22262A' as const,
    pin: 'rgba(242, 186, 74, 0.2)' as const
  },
  dropShadow: {
    default: 'drop-shadow(0 2px 4px rgba(33, 63, 99, 0.3))' as const
  }
}

export const darkTheme: Theme = {
  accent: {
    primary: '#4899F9',
    notification: '#F2994A',
    online: '#28F0E4',
    error: '#F26451'
  },
  background: {
    primary: '#242B33',
    secondary: '#1E262E',
    tertiary: '#1A242D',
    secondarySub: '#1E262F'
  },
  ui: {
    primary: '#F2F5F8',
    secondary: '#C7D0D9',
    tertiary: '#8795A3'
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#BAC2C9'
  }
}

export type ThemeClaim<T> = (theme: Theme, common: typeof commonStyles) => T

export type ThemeVariablesOrProperties =
  | CSS.Properties
  | ThemeVariables
  | TransparentThemeVariables
  | CSSCommonVariables

export const makeStyles = (claim: ThemeClaim<ThemeVariablesOrProperties>) => {
  return computed(() =>
    claim(darkTheme, commonStyles)
  )
}

export type CommonStyles = typeof commonStyles
