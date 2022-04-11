import { AsyncStorage } from 'vuex-persist'
// @ts-ignore
import { Store, get, set, del, clear, keys } from 'idb-keyval'

const store = new Store('vuex', 'vuex')

const indexedDBStorage: AsyncStorage = {
  // @ts-ignore
  getItem(key) {
    return get(key, store)
  },
  // @ts-ignore
  async setItem(key, val) {
    await set(key, val, store)
    return get(key, store)
  },
  removeItem(key) {
    return del(key, store)
  },
  clear() {
    return clear(store)
  },
  async length() {
    const ks = await keys(store)
    return ks.length
  },
  async key(keyIndex) {
    const ks = await keys(store)
    return ks[keyIndex] as string // keyName is limited to string
  }
}

export default indexedDBStorage
