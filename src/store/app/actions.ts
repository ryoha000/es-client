import { defineActions } from 'direct-vuex'
import { moduleActionContext } from 'src/store'
import { app } from './index'
import { ActionContext } from 'vuex'
import useScraping from 'src/components/use/useScraping'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const appContext = (
  context: ActionContext<unknown, unknown>
) => moduleActionContext(context, app)

export const actions = defineActions({
  async setSeiya(context) {
    const { commit } = appContext(context)
    const { getSeiyaGames } = useScraping()
    const s = await getSeiyaGames()
    commit.setSeiya(s)
  },
})
