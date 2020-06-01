<template>
  <div id="q-app" :class="$style.app" :style="styles.app">
    <side-bar :class="$style.sidebar" @game="goDetail" />
    <div :class="$style.mainview">
      <q-btn @click="onClick">aaa</q-btn>
      <main-view-header @next="next" @back="back" @home="goHome" />
      <home v-if="routeStack[routeIndex].type === 'Home'" />
      <game-detail v-if="routeStack[routeIndex].type === 'Game'" />
    </div>
  </div>
</template>

<script lang="ts">
import SideBar from './components/SideBar/SideBar.vue'
import MainViewHeader from './components/MainView/Header/MainViewHeader.vue'
import Home from './pages/Home.vue'
import GameDetail from './pages/GameDetail.vue'
import { defineComponent, reactive, computed, ref, Ref } from '@vue/composition-api'
import { StackType, Record, Game, Creator, Seiyu } from './types/root'
import { makeStyles } from './lib/style'
import useRouteStack from './components/use/useRouteStack'

import * as FS from 'fs'
import * as ChildProcess from 'child_process'

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
    const creators = ref<Record<number, Creator>>({})
    const seiyus = ref<Record<number, Seiyu>>({})
    const onClick = () => {
      // ChildProcess.spawn('powershell.exe', ['cd \'E:\\Program Files (x86)\\Whirlpool\\KUJIRA\' ; powershell Start-Process kujira.exe -verb runas'])
      // // TODO: Get Icon, ref: https://github.com/mtojo/node-system-icon, require rebuild
      // FS.stat('E:\\Program Files (x86)\\Whirlpool\\KUJIRA\\kujira.exe', (err, stat) => {
      //   console.log(stat)
      // })
      console.log('ido')
      routeIndex.value += 1
      routeStack.value.push({ type: 'Game', id: 123})
    }
    const styles = useStyles()
    const { next, back, goHome, goDetail } = useRouteStack(routeIndex, routeStack)
    return {
      onClick,
      styles,
      routeIndex,
      routeStack,
      games,
      creators,
      seiyus,
      next,
      back,
      goHome,
      goDetail
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
  width: 520px;
  flex: 0 0 240px;
}

.mainview {
  flex: 1, 1, calc( 100% - 240px );
  width: 100%;
  padding: 8px;
}
</style>