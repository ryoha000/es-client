import { defineGetters } from 'direct-vuex'
import { S } from './state'
import {
  entities,
} from './index'
import { moduleGetterContext } from '../../store'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const entitiesGetterContext = (args: [unknown, unknown, unknown, unknown]) =>
  moduleGetterContext(args, entities)

export const getters = defineGetters<S>()({
  getHaveGames(state) {
    return state.haveGames
  },
})
