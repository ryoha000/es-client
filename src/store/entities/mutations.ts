import Vue from 'vue'
import { defineMutations } from 'direct-vuex'
import { S } from './state'

type RecordKeyOf<R> = R extends Record<infer K, unknown> ? K : never
type RecordValueOf<R> = R extends Record<string, infer V> ? V : never

const setMutation = <O, K extends keyof O>(key: K) => (
  state: O,
  entities: O[K]
) => {
  state[key] = entities
}
const extendMutation = <O, K extends keyof O>(key: K) => (
  state: O,
  entities: O[K]
) => {
  state[key] = { ...state[key], ...entities }
}
const addMutation = <
  O extends Record<string, Record<string, unknown>>,
  K extends keyof O
>(
  key: K
) => (
  state: O,
  payload: { id: RecordKeyOf<O[K]>; entity: RecordValueOf<O[K]> }
) => {
  Vue.set(state[key], payload.id, payload.entity)
}
const deleteMutation = <
  O extends Record<string, Record<string, unknown>>,
  K extends keyof O
>(
  key: K
) => (state: O, entityId: RecordKeyOf<O[K]>) => {
  Vue.delete(state[key], entityId)
}

export const mutations = defineMutations<S>()({
  setGames: setMutation('games'),
  setMinimalGames: setMutation('minimalGames'),

  extendGames: extendMutation('games'),
  extentMinimalGames: extendMutation('minimalGames'),

  addGame: addMutation('games'),
  addMinimalGame: addMutation('minimalGames'),

  deleteGame: deleteMutation('games'),
  deleteMinimalGame: deleteMutation('minimalGames'),
})
