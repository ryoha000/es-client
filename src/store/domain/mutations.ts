import { defineMutations } from 'direct-vuex'
import { S } from './state'
import { Campaign, SellSchedule } from 'src/types/root'

export const mutations = defineMutations<S>()({
  setCampaigns(state, payload: Campaign[]) {
    state.campaigns = payload
  },
  setSchedules(state, payload: SellSchedule[]) {
    state.schedules = payload
  },
})
