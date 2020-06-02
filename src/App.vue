<template>
  <div id="q-app" :class="$style.app" :style="styles.app">
    <side-bar :class="$style.sidebar" @game="goDetail" />
    <div :class="$style.mainview">
      <q-btn @click="onClick">aaa</q-btn>
      <input type="file" webkitdirectory  />
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
import * as Path from 'path'
import * as ChildProcess from 'child_process'
import { remote } from 'electron'

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

    const showFiles = (dirpath: string, callback: (fp: string) => void) => {
      FS.readdir(dirpath, {withFileTypes: true}, (err, dirents) => {
        if (err) {
          console.error(err);
          return;
        }
        for (const dirent of dirents) {
          const fp = Path.join(dirpath, dirent.name);
          if (dirent.name.endsWith('.exe')) {
            callback(fp)
            break
          }
          if (dirent.isDirectory()) {
            showFiles(fp, callback);
          } else {
            callback(fp);
          }
        }
      });
    }

    const onClick = async () => {
      // ChildProcess.spawn('powershell.exe', ['cd \'E:\\Program Files (x86)\\Whirlpool\\KUJIRA\' ; powershell Start-Process kujira.exe -verb runas'])
      // // TODO: Get Icon, ref: https://github.com/mtojo/node-system-icon, require rebuild
      // FS.stat('E:\\Program Files (x86)\\Whirlpool\\KUJIRA\\kujira.exe', (err, stat) => {
      //   console.log(stat)
      // })
      console.log('ido')
      const dialog = remote.dialog
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory', 'multiSelections'],
        title: 'フォルダ(複数選択)',
        defaultPath: '.'
      })
      FS.readdir
      console.log(result.filePaths)
      for (const filePath of result.filePaths) {
        showFiles(filePath, console.log)
      }
    }
    const styles = useStyles()
    const { next, back, goHome, goDetail } = useRouteStack(routeIndex, routeStack)
    return {
      onClick,
      styles,
      routeIndex,
      routeStack,
      games,
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