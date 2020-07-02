import { Campaign, SellSchedule } from 'src/types/root'

export type S = {
  campaigns: Campaign[]
  schedules: SellSchedule[]
}

export const state: S = {
  campaigns: [],
  schedules: [],
}
