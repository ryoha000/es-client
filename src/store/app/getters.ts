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
