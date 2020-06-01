export interface StackType {
  type: 'Home' | 'Game' | 'Search'
  id: number
}

export interface Game {
  id: number
  name: string
  furigana: string
  brandId: number
  brandName: string
  officialHomePage: string
  sellday: string
  imgUrl: string
  median: number
  average: number
  count: number
  creatorIds: number[]
  createdAt: Date
}

export interface Creator {
  id: number
  name: string
  furigana: string
  createdAt: Date
}

export interface Seiyu extends Creator {
  role: string
  importance: number // 0 => Main, 1 => Sub, 2 => Mob
}

export interface Brand {
  id: number
  name: string
  furigana: string
  officialHomePage: string
  median: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Record<K extends keyof any, T> = {
  [P in K]: T;
};