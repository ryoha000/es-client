export interface StackType {
  type: 'Home' | 'Game' | 'Search'
  id: number
}

export type GameDetail = {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Record<K extends keyof any, T> = {
  [P in K]: T;
};

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
  day: string
  games: Game[]
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

export interface Brand {
  id: number,
  brandname: string,
  brandfurigana: string | null,
  makername: string | null,
  makerfurigana: string | null,
  url: string | null,
  checked: boolean | null,
  kind: string | null,
  lost: boolean | null,
  directlink: boolean | null,
  median: number | null,
  http_response_code: number | null,
  twitter: string | null,
  twitter_data_widget_id: number | null,
  notes: string | null,
  erogetrailers: number | null,
  cien: number | null,
}

export interface Game {
  id: number
  gamename: string | null
  furigana: string | null
  median: number | null
  stdev: number | null
  count2: number | null
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
  genre:	string | null
  twitter:	string | null
  twitter_data_widget_id: number | null
  masterup: string |null
  steam: number | null
  dlsite_rental: boolean | null
  dmm_subsc: string | null
  surugaya_1: number | null
}

export interface Campaign {
  id: number,
  name: string | null,
  url: string | null,
  end_timestamp: string | null,
  content: string | null,
  store: number | null,
  games: CampaignGame[],
}

export interface CampaignGame extends Game {
  median: number,
  stdev: number,
  count2: number,
  content: string | null,
  url: string | null,
}

export interface GameAndBrand {
  game: Game,
  brand: Brand,
}

export interface Timeline {
  id: string,
  user_id: string,
  game_id: string,
  log_type: number,
  created_at: string,
}

export enum LogType {
  Play,
  Review,
  List,
}

export interface MaskedTimeline {
  timeline: Timeline,
  review: Review | null,
  // list: List | null,
  game: Game,
  user: User,
}

export interface Review {
  id: string | null,
  game_id: number,
  user_id: string,
  es_user_id: string,
  tokuten: number | null,
  tourokubi: string | null,
  hitokoto: string | null,
  memo: string | null,
  netabare: boolean | null,
  giveup: boolean | null,
  possession: boolean | null,
  play: boolean | null,
  before_hitokoto: string | null,
  before_tokuten: number | null,
  before_tourokubi: string | null,
  display: boolean | null,
  play_tourokubi: string | null,
  display_unique_count: number | null,
  sage: boolean | null,
  before_purchase_will: string | null,
  before_sage: boolean | null,
  total_play_time: number | null,
  time_before_understanding_fun: number | null,
  okazu_tokuten: number | null,
  trial_version_hitokoto: string | null,
  trial_version_hitokoto_sage: boolean | null,
  trial_version_hitokoto_tourokubi: string | null,
  es_id: number | null,
  created_at: string | null,
  updated_at: string | null,
}

export interface Follow {
  id: string,
  followee_id: string,
  follower_id: string,
  allowed: boolean,
  mutual: boolean,
  comment: string,
  created_at: string,
  deleted_at: string,
}

export interface FollowWithUser {
  follow: Follow,
  user: User
}
