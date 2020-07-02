import { defineActions } from 'direct-vuex'
import { moduleActionContext } from '../../store'
import { entities } from './index'
import { reduceToRecord } from '../../lib/util/record'
import { getMinimalGames, getGame, getGamesWithoutNumByIds } from '../../lib/api'
import { ActionContext } from 'vuex'
import useJson from 'src/components/use/useJson'
import useScraping from 'src/components/use/useScraping'

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
    commit.addHaveGame({id: `${id}`, entity: data.game})
  },
  async setHaveGames(context) {
    const { commit } = entitiesActionContext(context)
    const { getHaveGameIdArray } = useJson()
    const haveGameIDs = await getHaveGameIdArray()
    const data = await getGamesWithoutNumByIds(haveGameIDs ?? [])
    commit.setHaveGames(reduceToRecord(data, 'id'))
  },
  async setGameDetails(context, id: number) {
    const { commit, state, rootCommit } = entitiesActionContext(context)
    if (id in state.gameDetails) {
      rootCommit.domain.setGameDetail(state.gameDetails[id])
      return
    }
    const { getGameDetail } = useScraping()
    const game = await getGameDetail(id)
    game.name = game.name.replace('&amp;', ' ')
    game.brandName = game.brandName.replace('&amp;', ' ')
    commit.addGameDetail({ id: id, entity: game })
    rootCommit.domain.setGameDetail(state.gameDetails[id])
  },
})
