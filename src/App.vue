<template>
  <div
    v-if="!isLoading"
    id="q-app"
    :class="$style.app"
    :style="styles.app"
    @drop.prevent="dropFile"
    @dragover.prevent
  >
    <side-bar :class="$style.sidebar" @game="setGame" />
    <div :class="$style.mainview">
      <main-view-header @next="next" @back="back" @home="goHome" :routeStack="routeStack" :routeIndex="routeIndex" />
      <div>
        <home v-if="routeStack[routeIndex].type === 'Home'" :sellSchedules="sellSchedules"/>
        <game-detail
          v-if="routeStack[routeIndex].type === 'Game'"
          :games="games"
          :id="gameId"
        />
      </div>
    </div>
  </div>
  <div v-else>Now Loading...</div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import SideBar from './components/SideBar/SideBar.vue'
import MainViewHeader from './components/MainView/Header/MainViewHeader.vue'
import Home from './pages/Home.vue'
import GameDetail from './pages/GameDetail.vue'
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import { StackType, Record, Game, ListGame, List, SellSchedule } from './types/root'
import { makeStyles } from './lib/style'
import useRouteStack from './components/use/useRouteStack'
import useDictionary from './components/use/useDictionary'
import useJson from './components/use/useJson'
import store from 'src/store'

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
    const sellSchedules = ref<SellSchedule[]>([])
    const isLoading = ref(true)

    const { jsonSetup, addGameToList } = useJson()
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

    const dropFile = async (event: DragEvent) => {
      const minimalGames = store.state.entities.minimalGames
      const { getEXE } = useJudgeGame(minimalGames)
      try {
        const dragFilePath = event.dataTransfer?.files[0].path
        console.log(Object.values(minimalGames))
        if (dragFilePath) {
          const newListGames = await getEXE([dragFilePath])
          if (newListGames.length === 0) {
            alert('ゲームを特定できませんでした')
            return
          }
          await addGameToList(0, newListGames[0])
          alert(`${minimalGames[newListGames[0].id].gamename}が追加されました`)
        }
      } catch (e) {
        console.error(e)
      }
    }

    const { getSchedule, checkUpdate } = useScraping()
    
    onMounted(async () => {
      isLoading.value = true
      try {
        await jsonSetup()
      } catch (e) {
        alert('設定ファイルを作れません\n管理者権限を与えるか、必要なさそうなところで実行してください')
      }
      try {
        // TODO: 並列化
        await store.dispatch.entities.setAllMinimalGames()
        await store.dispatch.entities.setHaveGames()
        await store.dispatch.app.setLists()
        await store.dispatch.domain.setCampaign()
        // await store.dispatch.app.setSeiya()

        // allDMM.value = await getAllDMM()
        // sellSchedules.value = await getSchedule()
      } catch (e) {
        console.error(e)
      }
      try {
        // update時はここを変える
        if (await checkUpdate(1.5)) {
          alert('アップデートがあります\nURL: https://github.com/ryoha000/es-client/releases')
        }
      } catch (e) {
        console.error(e)
      }
      isLoading.value = false
    })
    return {
      styles,
      routeIndex,
      routeStack,
      isLoading,
      games,
      gameId,
      next,
      back,
      goHome,
      goDetail,
      setGame,
      sellSchedules,
      dropFile
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