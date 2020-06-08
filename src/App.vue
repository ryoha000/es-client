<template>
  <div id="q-app" :class="$style.app" :style="styles.app">
    <side-bar :class="$style.sidebar" @game="setGame" :haveGame="haveGame" :games="allDMM" @addGame="addGame" :lists="lists" @createList="createList" />
    <div :class="$style.mainview">
      <main-view-header @next="next" @back="back" @home="goHome" :routeStack="routeStack" :routeIndex="routeIndex" />
      <div v-if="!isLoading">
        <home v-if="routeStack[routeIndex].type === 'Home'" :campaigns="campaigns" :sellSchedules="sellSchedules" :lists="lists" />
        <game-detail
          v-if="routeStack[routeIndex].type === 'Game'"
          :games="games"
          :id="gameId"
          :haveGame="haveGame"
          :seiya="seiya"
          :lists="lists"
          @createList="createList"
        />
      </div>
      <div v-else>Now Loading...</div>
    </div>
  </div>
</template>

<script lang="ts">
import SideBar from './components/SideBar/SideBar.vue'
import MainViewHeader from './components/MainView/Header/MainViewHeader.vue'
import Home from './pages/Home.vue'
import GameDetail from './pages/GameDetail.vue'
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import { StackType, Record, Game, Campaign, ListGame, List, DMM, SellSchedule } from './types/root'
import { makeStyles } from './lib/style'
import useRouteStack from './components/use/useRouteStack'
import useDictionary from './components/use/useDictionary'
import useJson from './components/use/useJson'

import { remote } from 'electron'
import useScraping from './components/use/useScraping'
import useJudgeGame from './components/use/useJudgeGame'

const useStyles = () => 
  reactive({
    app: makeStyles(theme => ({
        backgroundColor: theme.background.primary
      })
    )
  })

export default defineComponent ({
  name: 'App',
  components: {
    SideBar,
    MainViewHeader,
    Home,
    GameDetail
  },
  setup() {
    const routeIndex = ref(0)
    const routeStack = ref<StackType[]>([{ type: 'Home', id: 0 }])
    const games = ref<Record<number, Game>>({})
    const gameId = ref(0)
    const campaigns = ref<Campaign[]>([])
    const sellSchedules = ref<SellSchedule[]>([])
    const haveGame = ref<Record<number, ListGame>>({})
    const lists = ref<List[]>([])
    const isLoading = ref(true)
    const allDMM = ref<Record<number, DMM>>({})
    const seiya = ref<{createdNow: number, games: {name: string, url: string}[]}>({createdNow: Date.now(), games: []})

    const { jsonSetup, readListGames, readFileConsoleErr, getHaveGame } = useJson()
    const { searchAll, searchDifference } = useJudgeGame(allDMM.value)
    const addGameFolder = async () => {
      // console.log('ido')
      // const dialog = remote.dialog
      // const result = await dialog.showOpenDialog({
      //   properties: ['openDirectory', 'multiSelections'],
      //   title: 'フォルダ(複数選択)',
      //   defaultPath: '.'
      // })
      // console.log(result.filePaths)
      const gl: Record<number, ListGame> = {}
      const listGames = (await searchDifference())
      listGames.forEach(element => {
        gl[element.id] = element
      })
      haveGame.value = gl
      //console.log(editONP('金色ラブリッチェ -GOLDEN TIME-', '金色ラブリッチェ-GOLDENTIME-'))
    }
    const styles = useStyles()
    const { next, back, goHome, goDetail } = useRouteStack(routeIndex, routeStack)
    const { getOrSelect } = useDictionary(games)
    const setGame = async (id: number) => {
      isLoading.value = true
      gameId.value = id
      const game = await getOrSelect(id)
      games.value[id] = game
      isLoading.value = false
      goDetail(id)
    }

    const addGame = async () => {
      haveGame.value = await readListGames(0)
    }
    const createList = async () => {
      lists.value = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      const newHaveGame: Record<number, ListGame> = {}
      lists.value.find(v => v.id === 0)?.games.forEach(v => {
        newHaveGame[v.id] = v
      })
      haveGame.value = newHaveGame
    }

    const { getCampaignWithImage, getSchedule, getSeiyaGames, getAllDMM, checkUpdate } = useScraping()
    
    // eslint-disable-next-line @typescript-eslint/require-await
    onMounted(async () => {
      isLoading.value = true
      jsonSetup()
      try {
        const nowLists: List[] = JSON.parse(await readFileConsoleErr('setting/lists.json'))
        lists.value = nowLists
        haveGame.value = getHaveGame(nowLists)
      } catch(e) {
        console.error(e)
      }
      try {
        // const a = JSON.parse(await readFileConsoleErr('setting/dmm.json'))
        // const ad: Record<number, DMM> = {}
        // for (const d of a.games) {
        //   ad[d.id] = d

        // }
        // allDMM.value = ad
        if (seiya.value.games.length === 0 || Date.now() - seiya.value.createdNow > 1000*60*60*24) {
          await getSeiyaGames(seiya)
        }
        allDMM.value = await getAllDMM()
        campaigns.value = await getCampaignWithImage(allDMM)
        sellSchedules.value = await getSchedule()
      } catch (e) {
        console.error(e)
      }
      try {
        // update時はここを変える
        if (await checkUpdate(1.01)) {
          alert('アップデートがあります')
        }
      } catch (e) {
        console.error(e)
      }
      isLoading.value = false
    })
    return {
      addGameFolder,
      styles,
      routeIndex,
      routeStack,
      isLoading,
      games,
      gameId,
      haveGame,
      next,
      back,
      goHome,
      goDetail,
      setGame,
      campaigns,
      sellSchedules,
      allDMM,
      seiya,
      addGame,
      createList,
      lists
    }
  }
})
</script>

<style lang="scss" module>
.app {
  color: aliceblue;
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
}

.sidebar {
  flex: 0 0 240px;
}

.mainview {
  flex: 1, 1, calc( 100% - 240px );
  width: 100%;
  padding: 8px;
  padding-bottom: 0;
}
</style>