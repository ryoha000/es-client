import { defineGetters } from 'direct-vuex'
import { S } from './state'
import { app } from './index'
import { moduleGetterContext } from '../../store'
import { List, ListGame } from 'src/types/root'
import { reduceToRecord } from 'src/lib/util/record'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getterContext = (args: [unknown, unknown, unknown, unknown]) =>
  moduleGetterContext(args, app)

export const getters = defineGetters<S>()({
  getListById(state): (id: number) => List | undefined {
    return (id: number) => {
      const list = state.lists.find(l => l.id === id)
      if (!list) { console.error(`there is no the list has propaty of id is ${id}`)}
      return list
    }
  },
  getSortedAndFilterdGameList(...args): (id: number, isSortListByLastAccess: boolean, searchString: string) => ListGame[] | undefined {
    return (id: number, isSortListByLastAccess: boolean, searchString: string) => {
      const { state, rootState } = getterContext(args)
      const prevList = state.lists.find(l => l.id === id)
      if (!prevList) { console.error(`there is no the list has propaty of id is ${id}`) ; return undefined }
      let games = [...prevList.games]
      if (searchString) {
        games = games.filter(v => rootState.entities.haveGames[`${v.id}`].gamename?.includes(searchString))
      }
      if (isSortListByLastAccess) {
        const birthTimeMap: Record<number, Date> = state.lastGameAccessTime
        games.sort((a, b) => {
          const aTime = birthTimeMap[a.id]
          const bTime = birthTimeMap[b.id]
          if (!aTime && !bTime) {
            return 0
          } else if (!aTime) {
            return 1
          } else if (!bTime) {
            return -1
          } else {
            return aTime > bTime ? -1 : 1
          }
        })
      } else {
        games.sort((a, b) => {
          return ((rootState.entities.haveGames[`${a.id}`]?.furigana ?? '') < (rootState.entities.haveGames[`${b.id}`]?.furigana ?? '')) ? -1 : 1
        })
      }
      return games
    }
  },
  getListGameByGameId(state): (id: number) => ListGame | undefined {
    return (id: number) => {
      const list = state.lists.find(l => l.id === 0)
      if (!list) {
        console.error(`there is no the list has propaty of id is ${id}`)
        return
      }
      return list.games.find(v => v.id === id)
    }
  },
  getRecord(state): () =>  Record<string, ListGame> {
    return () => {
      const list = state.lists.find(l => l.id === 0)
      if (!list) {
        return {} as Record<string, ListGame>
      }
      return reduceToRecord(list.games, 'id')
    }
  },
})
