import { defineGetters } from 'direct-vuex'
import { S } from './state'
import { domain } from './index'
import { moduleGetterContext } from '../../store'

const getterContext = (args: [unknown, unknown, unknown, unknown]) =>
  moduleGetterContext(args, domain)

export const getters = defineGetters<S>()({
})
