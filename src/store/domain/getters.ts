import { defineGetters } from 'direct-vuex'
import { S } from './state'
import { domain } from './index'
import { moduleGetterContext } from '../../store'
import { ListInServer, ListInServerWithGames } from 'src/types/root'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getterContext = (args: [unknown, unknown, unknown, unknown]) =>
  moduleGetterContext(args, domain)

export const getters = defineGetters<S>()({
  getLists(state): () => ListInServerWithGames[] {
    return () => {
      const lists = state.listInServers
      return lists
    }
  },
  getSimpleLists(state): () => ListInServer[] {
    return () => {
      const lists = state.listInServers.map(v => v.list)
      return lists
    }
  },
})
