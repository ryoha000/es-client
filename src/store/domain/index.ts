import { defineModule } from 'direct-vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'

/**
 * サーバーから取得したエンティティを扱うstore
 *
 * このモジュールのstateは id => body の形をしたRecordのみ許す
 */
export const domain = defineModule({
  namespaced: true,
  state,
  getters,
  mutations,
  actions
})