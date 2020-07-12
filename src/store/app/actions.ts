import { defineActions } from 'direct-vuex'
import { moduleActionContext } from 'src/store'
import { app } from './index'
import { ActionContext } from 'vuex'
import useScraping from 'src/components/use/useScraping'
import useJson from 'src/components/use/useJson'
import { ListGame, List } from 'src/types/root'
import * as fs from 'fs'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const appActionContext = (
  context: ActionContext<unknown, unknown>
) => moduleActionContext(context, app)

export const actions = defineActions({
  async setSeiya(context) {
    const { commit } = appActionContext(context)
    const { getSeiyaGames } = useScraping()
    const s = await getSeiyaGames()
    commit.setSeiya(s)
  },
  async setLists(context) {
    const { commit } = appActionContext(context)
    const { getLists } = useJson()
    commit.setLists((await getLists()).sort((a, b) => (a.priority ?? 0) < (b.priority ?? 0) ? -1 : 1))
  },
  addListGames(context, payload: { id: number , games: ListGame[] }) {
    const { commit, state } = appActionContext(context)
    const lists: List[] = []
    for (const list of state.lists) {
      if (list.id === payload.id) {
        lists.push({ id: list.id, name: list.name, games: [...list.games, ...payload.games]})
      } else {
        lists.push(list)
      }
    }
    commit.setLists(lists)
  },
  setListGames(context, payload: { id: number , games: ListGame[] }) {
    const { commit, state } = appActionContext(context)
    const lists: List[] = []
    for (const list of state.lists) {
      if (list.id === payload.id) {
        lists.push({ id: list.id, name: list.name, games: [...payload.games]})
      } else {
        lists.push(list)
      }
    }
    commit.setLists(lists)
  },
  async setAccessTimeMap(context) {
    const { commit, getters } = appActionContext(context)
    const list = getters.getListById(0)
    const birthTimeMap: Record<number, Date> = {}
    const promises: Promise<{ id: number, stats: fs.Stats }>[] = []
    const pFunc = async (lg: ListGame) => {
      return { id: lg.id, stats: await fs.promises.stat(lg.path)}
    }
    for (const listGame of list?.games ?? []) {
      if (listGame.id === 29016) {
        console.log('assss')
      }
      promises.push(pFunc(listGame))
    }
    for (const res of await Promise.allSettled(promises)) {
      if (res.value) {
        birthTimeMap[res.value.id] = res.value.stats.birthtime
      }
    }
    commit.setLastGameAccessTime(birthTimeMap)
  },
  async addAccessTimeMap(context, listGame: ListGame) {
    const { commit } = appActionContext(context)
    const pFunc = async (lg: ListGame) => {
      return { id: lg.id, stats: await fs.promises.stat(lg.path)}
    }
    const res = await pFunc(listGame)
    
    commit.addLastGameAccessTime({ id: res.id, aTime: res.stats.birthtime })
  },
  next(context) {
    const { state, commit } = appActionContext(context)
    if (state.routeStack.length > state.routeIndex + 1) {
      commit.setRouteIndex(state.routeIndex + 1)
      console.log('next')
    }
  },
  back(context) {
    const { state, commit } = appActionContext(context)
    if (state.routeStack.length > state.routeIndex && state.routeIndex !== 0) {
      commit.setRouteIndex(state.routeIndex - 1)
      console.log('back')
    }
  },
  goHome(context) {
    const { state, commit } = appActionContext(context)
    if (state.routeStack.length <= state.routeIndex) {
      commit.setRouteStack([{ type: 'Home', id: 0 }])
      commit.setRouteIndex(0)
      console.log('home index err')
      return
    }
    if (state.routeStack[state.routeIndex].type === 'Home') {
      console.log('home now')
      return
    }
    if (state.routeStack.length !== state.routeIndex + 1) {
      commit.spliceRouteStack(state.routeIndex + 1)
      console.log('home not top')
    }
    commit.addRouteStack({ type: 'Home', id: 0 })
    commit.setRouteIndex(state.routeIndex + 1)
    console.log('home end')
    return
  },
  async goDetail(context, id: number) {
    const { state, commit, rootDispatch } = appActionContext(context)
    if (state.routeStack.length <= state.routeIndex) {
      commit.setRouteStack([{ type: 'Game', id: id }])
      commit.setRouteIndex(0)
      console.log('game index err')
      return
    }
    if (state.routeStack[state.routeIndex].id === id) {
      console.log('game now')
      return
    }
    if (state.routeStack.length !== state.routeIndex + 1) {
      commit.spliceRouteStack(state.routeIndex + 1)
      console.log('game not top')
    }
    commit.addRouteStack({ type: 'Game', id: id })
    commit.setRouteIndex(state.routeIndex + 1)
    // await rootDispatch.domain.setGame(id)
    await rootDispatch.entities.setGameDetails(id)
    console.log('game end')
    return
  },
})
