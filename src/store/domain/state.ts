import { Campaign, SellSchedule, GameAndBrand, GameDetail } from 'src/types/root'

export type S = {
  campaigns: Campaign[]
  schedules: SellSchedule[]
  game: GameAndBrand | null
  gameDetail: GameDetail | null
}

export const state: S = {
  campaigns: [],
  schedules: [],
  game: null,
  gameDetail: null,
}
