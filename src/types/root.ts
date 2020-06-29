import { number } from "yargs";

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
  createdAt: string |null
}

export interface Creator {
  id: number
  name: string
  furigana: string
  createdAt: string |null
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
    isMasterup: boolean | null
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

export interface MinimalGame {
  id: number
  gamename: string
}

export interface User {
  id: string
  es_user_id: string
  display_name: string
  comment: string | null
  show_all_users: boolean | null
  show_detail_all_users: boolean | null
  show_followers: boolean | null
  show_followers_okazu: boolean | null
  twitter_id: string | null
  icon_url: string | null
}

export interface Game1 {
  id: number
  gamename: string | null
  furigana: string | null
  sellday:	string |null
  brand_id:	number
  comike:	number | null
  shoukai:	string | null
  model:	string | null
  erogame:	boolean | null
  banner_url:	string | null
  gyutto_id:	number | null
  dmm:	string | null
  dmm_genre:	string | null
  dmm_genre_2:	string | null
  erogametokuten: number | null
  total_play_time_median: number | null
  time_before_understanding_fun_median: number | null
  dlsite_id:	string | null
  dlsite_domain:	string | null
  trial_url:	string | null
  okazu:	boolean | null
  axis_of_soft_or_hard: number | null
  genre:	string | null
  twitter:	string | null
  digiket:	string | null
  twitter_data_widget_id: number | null
  masterup: string |null
  steam: number | null
  dlsite_rental: boolean | null
  dmm_subsc: string | null
  surugaya_1: number | null
}