import { defineActions } from 'direct-vuex'
import { moduleActionContext } from 'src/store'
import { domain } from './index'
import { ActionContext } from 'vuex'
import { getCampaigns, getSchedules, getGame } from 'src/lib/api'
import moment, { Moment } from 'moment'
import { SellSchedule } from 'src/types/root'

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
  }
})
