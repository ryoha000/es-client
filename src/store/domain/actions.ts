import { defineActions } from 'direct-vuex'
import { moduleActionContext } from 'src/store'
import { domain } from './index'
import { ActionContext } from 'vuex'
import { getCampaigns } from 'src/lib/api'

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
})
