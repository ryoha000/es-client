import { defineActions } from 'direct-vuex'
import { moduleActionContext } from '../../store'
import { entities } from './index'
import { reduceToRecord } from '../../lib/util/record'
import { getMinimalGames, getGame } from '../../lib/api'
import { ActionContext } from 'vuex'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const entitiesActionContext = (
  context: ActionContext<unknown, unknown>
) => moduleActionContext(context, entities)

export const actions = defineActions({
  async setAllMinimalGames(context) {
    const { commit } = entitiesActionContext(context)
    const data = await getMinimalGames()
    commit.setMinimalGames(reduceToRecord(data, 'id'))
  },
  async fetchGame(context, id: number) {
    const { commit } = entitiesActionContext(context)
    const data = await getGame(id)
    commit.addGame({id: id, entity: data})
  },
})
