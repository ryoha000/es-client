import { defineActions } from 'direct-vuex'
import { moduleActionContext } from 'src/store'
import { app } from './index'
import { ActionContext } from 'vuex'
import useScraping from 'src/components/use/useScraping'
import { ListGame } from 'src/types/root'
import { reduceToRecord } from 'src/lib/util/record'
import useJson from 'src/components/use/useJson'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const appActionContext = (
  context: ActionContext<unknown, unknown>
) => moduleActionContext(context, app)

export const actions = defineActions({
  async setSeiya(context) {
    const { commit } = appActionContext(context)
    const { getSeiyaGames } = useScraping()
    const s = await getSeiyaGames()
    commit.setSeiya(s)
  },
  async setLists(context) {
    const { commit } = appActionContext(context)
    const { getLists } = useJson()
    commit.setLists(await getLists())
  },
})
