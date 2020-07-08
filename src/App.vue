<template>
  <div
    v-if="!isLoading"
    id="q-app"
    :class="$style.app"
    :style="styles.app"
    @drop.prevent="dropFile"
    @dragover.prevent
  >
    <side-bar :class="$style.sidebar" />
    <div :class="$style.mainview">
      <main-view-header :routeStack="routeStack" :routeIndex="routeIndex" />
      <div>
        <home v-if="routeStack[routeIndex].type === 'Home'" />
        <game-detail v-if="routeStack[routeIndex].type === 'Game'" />
      </div>
    </div>
    
    <portal-target name="tooltip" :style="styles.tooltip" :class="$style.tooltip"></portal-target>
  </div>
  <div v-else>Now Loading...</div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import SideBar from './components/SideBar/SideBar.vue'
import MainViewHeader from './components/MainView/Header/MainViewHeader.vue'
import Home from './pages/Home.vue'
import GameDetail from './pages/GameDetail.vue'
import { defineComponent, reactive, ref, onMounted, computed, ComputedRef } from '@vue/composition-api'
import { makeStyles } from './lib/style'
import useJson from './components/use/useJson'
import store from 'src/store'

import useScraping from './components/use/useScraping'
import useJudgeGame from './components/use/useJudgeGame'

const SIDE_BAR_WIDTH = 240
const TOOLTIP_WIDTH = 160
const TOOLTIP_HEIGHT = 200
const HEADER_HEIGHT = 52

const useStyles = (mouse: ComputedRef<{ x: number, y: number }>) => 
  reactive({
    app: makeStyles(theme => ({
        backgroundColor: theme.background.primary
      })
    ),
    tooltip: makeStyles(() => ({
        bottom: `${window.innerHeight - mouse.value.y - 8}px`,
        left: `${mouse.value.x -TOOLTIP_WIDTH - 8}px`,
      })
    ),
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
    const routeIndex = computed(() => store.state.app.routeIndex)
    const routeStack = computed(() => store.state.app.routeStack)

    const isLoading = ref(true)

    const { jsonSetup, addGameToList } = useJson()
    const mouse = computed(() => store.state.app.tooltipPoint)
    const styles = useStyles(mouse)
    const setGame = async (id: number) => {
      isLoading.value = true
      isLoading.value = false
      await store.dispatch.app.goDetail(id)
    }

    const dropFile = async (event: DragEvent) => {
      const minimalGames = store.state.entities.minimalGames
      const { getEXE } = useJudgeGame(minimalGames)
      try {
        const dragFilePath = event.dataTransfer?.files[0].path
        if (dragFilePath) {
          const newListGames = await getEXE([dragFilePath])
          if (newListGames.length === 0) {
            alert('ゲームを特定できませんでした')
            return
          }
          await addGameToList(0, newListGames[0])
          await store.dispatch.entities.addHaveGames(newListGames[0].id)
          await store.dispatch.app.addAccessTimeMap(newListGames[0])
          alert(`${minimalGames[newListGames[0].id].gamename}が追加されました`)
        }
      } catch (e) {
        console.error(e)
      }
    }

    const { checkUpdate } = useScraping()
    
    onMounted(async () => {
      isLoading.value = true
      try {
        await jsonSetup()
      } catch (e) {
        alert('設定ファイルを作れません\n管理者権限を与えるか、必要なさそうなところで実行してください')
      }
      // TODO: 並列化
      await store.dispatch.entities.setAllMinimalGames()
      await store.dispatch.entities.setHaveGames()
      await store.dispatch.app.setLists()
      await store.dispatch.app.setAccessTimeMap()
      await store.dispatch.domain.setCampaign()
      await store.dispatch.domain.setSchedules()
      try {

        await store.dispatch.domain.setMe()
      } catch {}
      // await store.dispatch.app.setSeiya()
      try {
        await store.dispatch.domain.setSocket()

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
      setGame,
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

.tooltip {
  position: absolute;
}
</style>