import { defineMutations } from 'direct-vuex'
import { S } from './state'
import { Campaign, SellSchedule, GameAndBrand, GameDetail, User, MaskedTimeline, ListInServerWithGames, PostListStruct } from 'src/types/root'

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
      state.listInServers.sort((a, b) => a.list.priority < b.list.priority ? -1 : 1)
    } else {
      state.listInServers[index] = payload
    }
  },
  updateListInSercerByPostListStruct(state, payload: { id: string, struct: PostListStruct}) {
    state.listInServers = state.listInServers.map(v => {
      if (v.list.id === payload.id) {
        const list = v.list
        list.name = payload.struct.name
        list.comment = payload.struct.comment
        list.priority = payload.struct.priority
        list.url = payload.struct.url
        list.is_public = payload.struct.isPublic
        return { ...v, list: list }
      }
      return v
    })
  },
  sortListInSercer(state) {
    state.listInServers.sort((a, b) => a.list.priority < b.list.priority ? -1 : 1)
  },
  deleteListInSercer(state, payload: string) {
    state.listInServers = state.listInServers.filter(v => v.list.id !== payload)
  },
  deleteGamesFromListInServer(state, payload: { listId: string, gameIds: number[] }) {
    const updatedGames = state.listInServers.find(v => v.list.id === payload.listId)?.games.filter(v => !payload.gameIds.includes(v.id))
  },
})
