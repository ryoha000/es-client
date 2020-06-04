<template>
  <div id="q-app" :class="$style.app" :style="styles.app">
    <side-bar :class="$style.sidebar" @game="setGame" :gameInList="gameInList" />
    <div :class="$style.mainview">
      <q-btn @click="addGameFolder">aaa</q-btn>
      <input type="file" webkitdirectory  />
      <main-view-header @next="next" @back="back" @home="goHome" />
      <div v-if="!isLoading">
        <home v-if="routeStack[routeIndex].type === 'Home'" :campaigns="campaigns" />
        <game-detail
          v-if="routeStack[routeIndex].type === 'Game'"
          :games="games"
          :id="gameId"
          :gameInList="gameInList"
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
import { defineComponent, reactive, computed, ref, Ref, onMounted } from '@vue/composition-api'
import { StackType, Record, Game, Creator, Seiyu, Campaign, ListGame, List, DMM } from './types/root'
import { makeStyles } from './lib/style'
import useRouteStack from './components/use/useRouteStack'
import useDictionary from './components/use/useDictionary'
import useJson from './components/use/useJson'

import * as fs from 'fs'
import * as Path from 'path'
import * as ChildProcess from 'child_process'
import { remote } from 'electron'
import * as regedit from 'regedit'
import * as Iconv from 'iconv-lite'
import useScraping from './components/use/useScraping'
import useJudgeGame from './components/use/useJudgeGame'
import { editONP } from './components/use/useEditDistance'

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
    const { getCampaignWithImage } = useScraping()
    const routeIndex = ref(0)
    const routeStack = ref<StackType[]>([{ type: 'Home', id: 0 }])
    const games = ref<Record<number, Game>>({})
    const gameId = ref(0)
    const campaigns = ref<Campaign[]>([])
    const gameInList = ref<Record<number, ListGame>>({})
    const lists = ref<List[]>([])
    const isLoading = ref(true)
    const allDMM = ref<Record<number, DMM>>({})

    const { jsonSetup, updateOrInsertList, readFileConsoleErr, getHaveGame } = useJson()
    const { getEXE } = useJudgeGame(allDMM)
    const addGameFolder = async () => {
      // console.log('ido')
      // const dialog = remote.dialog
      // const result = await dialog.showOpenDialog({
      //   properties: ['openDirectory', 'multiSelections'],
      //   title: 'フォルダ(複数選択)',
      //   defaultPath: '.'
      // })
      // console.log(result.filePaths)
      const listGames = await getEXE()
      listGames.forEach(element => {
        gameInList.value[element.id] = element
      })
      updateOrInsertList({id: 0, name: '所持ゲーム', games: listGames})
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

    // eslint-disable-next-line @typescript-eslint/require-await
    onMounted(async () => {
      isLoading.value = true
      jsonSetup()
      try {
        const nowLists: List[] = JSON.parse(await readFileConsoleErr('setting/lists.json'))
        lists.value = nowLists
        gameInList.value = getHaveGame(nowLists)
      } catch(e) {
        console.error(e)
      }
      //campaigns.value = await getHome()
      try {
        //campaigns.value = await getCampaignWithImage(allDMM)
        await getCampaignWithImage(allDMM)
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
      gameInList,
      next,
      back,
      goHome,
      goDetail,
      setGame,
      campaigns
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
}

.sidebar {
  flex: 0 0 240px;
}

.mainview {
  flex: 1, 1, calc( 100% - 240px );
  width: 100%;
  padding: 8px;
}
</style>