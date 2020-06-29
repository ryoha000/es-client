import { defineGetters } from 'direct-vuex'
import { S } from './state'
import {
  entities,
  Undefinedable
} from './index'
import { moduleGetterContext } from '../../store'

const entitiesGetterContext = (args: [unknown, unknown, unknown, unknown]) =>
  moduleGetterContext(args, entities)

export const getters = defineGetters<S>()({
  // gradeTypeUserGroups(state) {
  //   return Object.values(state.userGroups).filter(
  //     group => group.type === 'grade'
  //   )
  // },
})
