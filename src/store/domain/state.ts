import { Campaign, SellSchedule, GameAndBrand, GameDetail, User, MaskedTimeline } from 'src/types/root'

export type S = {
  campaigns: Campaign[]
  schedules: SellSchedule[]
  game: GameAndBrand | null
  gameDetail: GameDetail | null
  me: User | null
  socket: WebSocket | null
  maskedTimelines: MaskedTimeline[]
}

export const state: S = {
  campaigns: [],
  schedules: [],
  game: null,
  gameDetail: null,
  me: null,
  socket: null,
  maskedTimelines: [],
}
