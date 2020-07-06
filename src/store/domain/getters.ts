import { defineGetters } from 'direct-vuex'
import { S } from './state'
import { domain } from './index'
import { moduleGetterContext } from '../../store'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getterContext = (args: [unknown, unknown, unknown, unknown]) =>
  moduleGetterContext(args, domain)

export const getters = defineGetters<S>()({
})
