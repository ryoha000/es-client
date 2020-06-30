import { defineModule } from 'direct-vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { ListGame } from 'src/types/root'

export type Seiya = { gamename: string, url: string }[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Undefinedable<T extends Record<string, any>> = Partial<T>

/**
 * サーバーから取得したエンティティを扱うstore
 *
 * このモジュールのstateは id => body の形をしたRecordのみ許す
 */
export const app = defineModule({
  namespaced: true,
  state,
  getters,
  mutations,
  actions
})