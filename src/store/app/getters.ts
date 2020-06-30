import { defineGetters } from 'direct-vuex'
import { S } from './state'
import { app } from './index'
import { moduleGetterContext } from '../../store'

const entitiesGetterContext = (args: [unknown, unknown, unknown, unknown]) =>
  moduleGetterContext(args, app)

export const getters = defineGetters<S>()({

})
