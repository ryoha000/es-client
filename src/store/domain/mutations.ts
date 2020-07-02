import { defineMutations } from 'direct-vuex'
import { S } from './state'
import { Campaign, SellSchedule, GameAndBrand, GameDetail } from 'src/types/root'

export const mutations = defineMutations<S>()({
  setCampaigns(state, payload: Campaign[]) {
    state.campaigns = payload
  },
  setSchedules(state, payload: SellSchedule[]) {
    state.schedules = payload
  },
  setGame(state, payload: GameAndBrand) {
    state.game = payload
  },
  setGameDetail(state, payload: GameDetail) {
    state.gameDetail = payload
  },
})
