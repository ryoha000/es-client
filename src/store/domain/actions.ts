import { defineActions } from 'direct-vuex'
import { moduleActionContext } from 'src/store'
import { domain } from './index'
import { ActionContext } from 'vuex'
import { getCampaigns, getSchedules, getGame, getMe, updateMe, postUser, getMaskedTimeline, getMyListInServers, postListInServer, addGameToListInServer, getListInServer, putListInServer, deleteListInServer, deleteGameFromListInServer, getMaskedTimelines } from 'src/lib/api'
import moment, { Moment } from 'moment'
import { SellSchedule, User, PostListStruct } from 'src/types/root'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const domainActionContext = (
  context: ActionContext<unknown, unknown>
) => moduleActionContext(context, domain)

export const actions = defineActions({
  async setCampaign(context) {
    const { commit } = domainActionContext(context)
    const campaigns = await getCampaigns()
    for (const c of campaigns) {
      c.games.sort((a, b) => a.median > b.median ? -1 : 1)
    }
    commit.setCampaigns(campaigns)
  },
  async setSchedules(context) {
    const { commit } = domainActionContext(context)
    const schedules = await getSchedules()
    schedules.sort((a, b) => moment(a.sellday ?? '') < moment(b.sellday ?? '') ? -1 : 1)
    const sellSchedules: SellSchedule[] = []
    let lastDay: Moment = moment(new Date())
    for (const s of schedules) {
      if (!moment(s.sellday).isSame(lastDay)) {
        lastDay = moment(s.sellday)
        sellSchedules.push({ day: `${lastDay.format('YYYY-MM-DD')}`, games: [s] })
      } else if (sellSchedules.length > 0) {
        sellSchedules[sellSchedules.length - 1].games.push(s)
      } else {
        lastDay = moment(s.sellday)
        sellSchedules.push({ day: `${lastDay.toString()}`, games: [s] })
      }
    }
    commit.setSchedules(sellSchedules)
  },
  async setGame(context, id: number) {
    const { commit } = domainActionContext(context)
    const game = await getGame(id)
    commit.setGame(game)
  },
  async setMe(context) {
    const { commit } = domainActionContext(context)
    const me = await getMe()
    if (!me.comment) me.comment = ''
    if (!me.twitter_id) me.twitter_id = ''
    if (!me.icon_url) me.icon_url = ''
    commit.setMe(me)
  },
  async updateMe(context, user: User) {
    const { commit } = domainActionContext(context)
    const updated_me = await updateMe(user)
    if (!updated_me.comment) updated_me.comment = ''
    if (!updated_me.twitter_id) updated_me.twitter_id = ''
    if (!updated_me.icon_url) updated_me.icon_url = ''
    commit.setMe(updated_me)
  },
  async login(context, payload: { name: string, password: string }) {
    const { dispatch, commit } = domainActionContext(context)
    const me = await postUser(payload.name, payload.password, true)
    if (!me.comment) me.comment = ''
    if (!me.twitter_id) me.twitter_id = ''
    if (!me.icon_url) me.icon_url = ''
    commit.setMe(me)
    // TODO: 並列
    await dispatch.setListInServers()
    await dispatch.setMaskedTimeline()
  },
  async signup(context, payload: { id: string, pw: string }) {
    const { commit } = domainActionContext(context)
    const me = await postUser(payload.id, payload.pw, false)
    if (!me.comment) me.comment = ''
    if (!me.twitter_id) me.twitter_id = ''
    if (!me.icon_url) me.icon_url = ''
    commit.setMe(me)
  },
  async logout(context) {
    const { dispatch, commit } = domainActionContext(context)
    commit.setMe(null)
    // TODO: 並列
    await dispatch.setListInServers()
    await dispatch.setMaskedTimeline()
  },
  async setMaskedTimeline(context) {
    const { commit } = domainActionContext(context)
    try {
      const tls = await getMaskedTimelines(0)
      commit.setTimeline(tls)
    } catch (e) { console.error(e) }
  },
  async addMaskedTimeline(context, id: string) {
    const { commit } = domainActionContext(context)
    try {
      const tl = await getMaskedTimeline(id)
      commit.addTimeline(tl)
    } catch (e) { console.error(e) }
  },
  async updateMaskedTimeline(context, id: string) {
    const { commit } = domainActionContext(context)
    try {
      const tl = await getMaskedTimeline(id)
      commit.updateTimeline(tl)
    } catch (e) { console.error(e) }
  },
  setSocket(context) {
    const { state ,commit, dispatch } = domainActionContext(context)
    const socket = new WebSocket('ws://localhost:8088/api/ws/');
    socket.onmessage = async function(event: MessageEvent) {
      await dispatch.addMaskedTimeline(event.data)
    }
    if (state.socket) state.socket.close()
    commit.setSocket(socket)
  },
  async setListInServers(context) {
    const { commit } = domainActionContext(context)
    const lists = await getMyListInServers()
    commit.setListInServers(lists.map(v => ({ list: v, games: [] })))
    commit.sortListInSercer()
  },
  async deleteList(context, payload: string) {
    const { commit, rootCommit } = domainActionContext(context)
    await deleteListInServer(payload)
    commit.deleteListInSercer(payload)
    rootCommit.entities.deleteListInServerGame(payload)
  },
  async addListInServer(context, payload: { name: string, comment: string, priority: number, url: string | null, isPublic: boolean }) {
    const { commit } = domainActionContext(context)
    const newList = await postListInServer(payload)
    commit.upsertListInServer({ list: newList, games: [] })
  },
  async addGames(context, payload: { list_id: string, game_ids: number[] }) {
    const { commit, rootCommit } = domainActionContext(context)
    await addGameToListInServer(payload.list_id, payload.game_ids)
    const list = await getListInServer(payload.list_id)
    commit.upsertListInServer(list)
    rootCommit.entities.addListInServerGame({ id: list.list.id, entity: list.games })
  },
  async setLatestList(context, listId: string) {
    const { commit, rootCommit } = domainActionContext(context)
    const latestList = await getListInServer(listId)
    commit.upsertListInServer(latestList)
    rootCommit.entities.addListInServerGame({ id: latestList.list.id, entity: latestList.games })
  },
  async putLists(context, payload: Record<string, PostListStruct>) {
    const { commit } = domainActionContext(context)
    const promises: Promise<void>[] = []
    const update = async (id: string, struct: PostListStruct) => {
      await putListInServer(id, struct)
      commit.updateListInSercerByPostListStruct({ id: id, struct: struct })
    }
    for (const p of Object.entries(payload)) {
      promises.push(update(p[0], p[1]))
    }
    await Promise.all(promises)
    commit.sortListInSercer()
  },
  async deleteGamesFromListInServer(context, payload: { listId: string, gameIds: number[] }) {
    const { commit, state, getters, rootCommit } = domainActionContext(context)
    const nowList = getters.getListById(payload.listId)
    if (!nowList) {
      console.error('list is not found')
      return
    }
    await deleteGameFromListInServer(payload.listId, payload.gameIds)
    const updatedGames = state.listInServers.find(v => v.list.id === payload.listId)?.games.filter(v => !payload.gameIds.includes(v.id)) ?? []
    nowList.games = updatedGames
    commit.upsertListInServer(nowList)
    rootCommit.entities.addListInServerGame({ id: nowList.list.id, entity: updatedGames })
  }
})
