import { defineMutations } from 'direct-vuex'
import { S } from './state'
import { Seiya } from '.'
import { List, StackType } from 'src/types/root'

export const mutations = defineMutations<S>()({
  setSeiya(state, payload: Seiya) {
    state.seiya = payload
  },
  setLists(state, payload: List[]) {
    state.lists = payload
  },
  addList(state, payload: List) {
    state.lists.push(payload)
  },
  removeList(state, payload: number) {
    state.lists = state.lists.filter(l => l.id !== payload)
  },
  setRouteIndex(state, payload: number) {
    state.routeIndex = payload
  },
  setRouteStack(state, payload: StackType[]) {
    state.routeStack = payload
  },
  addRouteStack(state, payload: StackType) {
    state.routeStack.push(payload)
  },
  spliceRouteStack(state, payload: number) {
    state.routeStack.splice(payload)
  }
})
