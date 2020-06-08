export interface StackType {
  type: 'Home' | 'Game' | 'Search'
  id: number
}

export type Game = {
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
  gengas: Creator[]
  sinarios: Creator[]
  seiyus: Seiyu[]
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

export interface CampaignGame {
  id: number
  title: string
  median: number
  content: string
  url: string
  imgUrl?: string
}

export interface Campaign {
  name: string
  url: string
  games: CampaignGame[]
}

export type ListGame = {
  id: number
  path: string
  icon?: string
}

export interface List {
  id: number,
  name: string
  games: ListGame[]
}

export interface DMM {
  id: number
  name: string
  dmm_genre: string
  dmm_genre_2: string
  dmm: string
}

export interface SellSchedule {
  dayAndCount: string
  games: {
    id: number
    name: string
    brandId: number
    brandName: string
    isMasterup: boolean
    image: string
  }[]
}

export interface Directory {
  dirPath: string
  children: Directory[]
}

export interface History {
  id: number
  time: number
}