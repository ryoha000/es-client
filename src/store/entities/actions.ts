import { defineActions } from 'direct-vuex'
import { moduleActionContext } from '../../store'
import { entities } from './index'
import { reduceToRecord } from '../../lib/util/record'
import { getMinimalGames, getGame, getGamesWithoutNumByIds } from '../../lib/api'
import { ActionContext } from 'vuex'
import useJson from 'src/components/use/useJson'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const entitiesActionContext = (
  context: ActionContext<unknown, unknown>
) => moduleActionContext(context, entities)

export const actions = defineActions({
  async setAllMinimalGames(context) {
    const { commit } = entitiesActionContext(context)
    const data = await getMinimalGames()
    console.log(data)
    commit.setMinimalGames(reduceToRecord(data, 'id'))
  },
  async fetchGame(context, id: number) {
    const { commit } = entitiesActionContext(context)
    const data = await getGame(id)
    commit.addHaveGame({id: `${id}`, entity: data})
  },
  async setHaveGames(context) {
    const { commit } = entitiesActionContext(context)
    const { getHaveGameIdArray } = useJson()
    const haveGameIDs = await getHaveGameIdArray()
    const data = await getGamesWithoutNumByIds(haveGameIDs ?? [])
    console.log(Object.values(reduceToRecord(data, 'id')))
    commit.setHaveGames(reduceToRecord(data, 'id'))
  },
})
