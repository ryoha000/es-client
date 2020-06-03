<template>
  <div id="q-app" :class="$style.app" :style="styles.app">
    <side-bar :class="$style.sidebar" @game="setGame" :gameInList="gamaInList" />
    <div :class="$style.mainview">
      <q-btn @click="onClick">aaa</q-btn>
      <input type="file" webkitdirectory  />
      <main-view-header @next="next" @back="back" @home="goHome" />
      <div v-if="!isLoading">
        <home v-if="routeStack[routeIndex].type === 'Home'" :campaigns="campaigns" />
        <game-detail
          v-if="routeStack[routeIndex].type === 'Game'"
          :games="games"
          :id="gameId"
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
import { StackType, Record, Game, Creator, Seiyu, Campaign, ListGame } from './types/root'
import { makeStyles } from './lib/style'
import useRouteStack from './components/use/useRouteStack'
import useDictionary from './components/use/useDictionary'

import * as FS from 'fs'
import * as Path from 'path'
import * as ChildProcess from 'child_process'
import { remote } from 'electron'
import * as regedit from 'regedit'
import * as Iconv from 'iconv-lite'
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
    const { getHome } = useScraping()
    const routeIndex = ref(0)
    const routeStack = ref<StackType[]>([{ type: 'Home', id: 0 }])
    const games = ref<Record<number, Game>>({})
    const gameId = ref(0)
    const campaigns = ref<Campaign[]>([])
    const gamaInList = ref<Record<number, ListGame>>([])
    const isLoading = ref(true)

    const onClick = async () => {
      // ChildProcess.spawn('powershell.exe', ['cd \'E:\\Program Files (x86)\\Whirlpool\\KUJIRA\' ; powershell Start-Process kujira.exe -verb runas'])
      // // TODO: Get Icon, ref: https://github.com/mtojo/node-system-icon, require rebuild
      // FS.stat('E:\\Program Files (x86)\\Whirlpool\\KUJIRA\\kujira.exe', (err, stat) => {
      //   console.log(stat)
      // })
      // ChildProcess.exec('powershell.exe -command start-process \'powershell.exe\' \'-command Install-Module IconExport\' -verb runas', (err, stdout, stderr) => {
      //   console.log(stdout)
      //   console.log(stderr)
      //   console.log(err)
      // })
      // TODO: Get Icon, ref: https://github.com/mtojo/node-system-icon, require rebuild
      // FS.stat('E:\\Program Files (x86)\\Whirlpool\\KUJIRA\\kujira.exe', (err, stat) => {
      //   console.log(stat)
      // })
      // console.log('ido')
      // const dialog = remote.dialog
      // const result = await dialog.showOpenDialog({
      //   properties: ['openDirectory', 'multiSelections'],
      //   title: 'フォルダ(複数選択)',
      //   defaultPath: '.'
      // })
      // console.log(result.filePaths)
      const { getEXE } = useJudgeGame()
      gamaInList.value = (await getEXE())
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
      if (campaigns.value.length === 0) {
        //campaigns.value = await getHome()
      }
      isLoading.value = false
    })
    return {
      onClick,
      styles,
      routeIndex,
      routeStack,
      isLoading,
      games,
      gameId,
      gamaInList,
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