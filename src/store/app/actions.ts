import { defineActions } from 'direct-vuex'
import { moduleActionContext } from 'src/store'
import { app } from './index'
import { ActionContext } from 'vuex'
import useScraping from 'src/components/use/useScraping'
import useJson from 'src/components/use/useJson'

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
    commit.setLists(await getLists())
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
  goDetail(context, id: number) {
    const { state, commit } = appActionContext(context)
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
    console.log('game end')
    return
  },
})
