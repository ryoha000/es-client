import { defineActions } from 'direct-vuex'
import { moduleActionContext } from 'src/store'
import { domain } from './index'
import { ActionContext } from 'vuex'
import { getCampaigns, getSchedules, getGame, getMe, updateMe, login, getMaskedTimeline } from 'src/lib/api'
import moment, { Moment } from 'moment'
import { SellSchedule, User } from 'src/types/root'

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
  async login(context, payload: { id: string, pw: string }) {
    const { dispatch } = domainActionContext(context)
    await login(payload.id, payload.pw)
    await dispatch.setMe()
  },
  async signup(context, payload: { id: string, pw: string }) {
    const { dispatch } = domainActionContext(context)
    await login(payload.id, payload.pw)
    await dispatch.setMe()
  },
  async addMaskedTimeline(context, id: string) {
    const { commit } = domainActionContext(context)
    try {
      const tl = await getMaskedTimeline(id)
      commit.addTimeline(tl)
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
})
