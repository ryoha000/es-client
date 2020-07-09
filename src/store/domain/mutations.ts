import { defineMutations } from 'direct-vuex'
import { S } from './state'
import { Campaign, SellSchedule, GameAndBrand, GameDetail, User, MaskedTimeline, ListInServerWithGames } from 'src/types/root'

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
  setMe(state, payload: User) {
    state.me = payload
  },
  setSocket(state, payload: WebSocket) {
    state.socket = payload
  },
  setTimeline(state, payload: MaskedTimeline[]) {
    state.maskedTimelines = payload
  },
  addTimeline(state, payload: MaskedTimeline) {
    state.maskedTimelines.unshift(payload)
  },
  setListInServers(state, payload: ListInServerWithGames[]) {
    state.listInServers = payload
  },
  upsertListInServer(state, payload: ListInServerWithGames) {
    const index = state.listInServers.findIndex(v => v.list.id === payload.list.id)
    if (index < 0) {
      state.listInServers.push(payload)
      state.listInServers.sort((a, b) => a.list.priority > b.list.priority ? 1 : -1)
    } else {
      state.listInServers[index] = payload
    }
  },
})
