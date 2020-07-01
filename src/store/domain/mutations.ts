import { defineMutations } from 'direct-vuex'
import { S } from './state'
import { Campaign } from 'src/types/root'

export const mutations = defineMutations<S>()({
  setCampaigns(state, payload: Campaign[]) {
    state.campaigns = payload
  },
})
