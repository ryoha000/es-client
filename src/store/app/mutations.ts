import { defineMutations } from 'direct-vuex'
import { S } from './state'
import { Seiya } from '.'

export const mutations = defineMutations<S>()({
  setSeiya(state, payload: Seiya) {
    state.seiya = payload
  }
})
