import { defineModule } from 'direct-vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'

import { MinimalGame, Game, GameDetail } from 'src/types/root'

export type MinimalGameMap = Record<string, MinimalGame>
export type GameMap = Record<string, Game>
export type GameDetailMap = Record<number, GameDetail>
export type ListMap = Record<string, Game[]>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Undefinedable<T extends Record<string, any>> = Partial<T>

/**
 * サーバーから取得したエンティティを扱うstore
 *
 * このモジュールのstateは id => body の形をしたRecordのみ許す
 */
export const entities = defineModule({
  namespaced: true,
  state,
  getters,
  mutations,
  actions
})
