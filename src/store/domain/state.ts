import { Campaign, SellSchedule, GameAndBrand, GameDetail, User } from 'src/types/root'

export type S = {
  campaigns: Campaign[]
  schedules: SellSchedule[]
  game: GameAndBrand | null
  gameDetail: GameDetail | null
  me: User | null
}

export const state: S = {
  campaigns: [],
  schedules: [],
  game: null,
  gameDetail: null,
  me: null,
}
