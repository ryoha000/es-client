<template>
  <div id="q-app" :class="$style.app" :style="styles.app">
    <side-bar :class="$style.sidebar" @game="setGame" />
    <div :class="$style.mainview">
      <q-btn @click="onClick">aaa</q-btn>
      <input type="file" webkitdirectory  />
      <main-view-header @next="next" @back="back" @home="goHome" />
      <home v-if="routeStack[routeIndex].type === 'Home'" />
      <game-detail
        v-if="routeStack[routeIndex].type === 'Game'"
        :game="game"
      />
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
import * as regedit from 'regedit'

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
    const game = ref<Game | null>(null)
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
      // const vbsDirectory = Path.join(Path.dirname(remote.app.getPath('exe')), './resources/my-location');
      // regedit.setExternalVBSLocation(vbsDirectory)
      regedit.list(['HKCU\\SOFTWARE\\3rdEye\\レイルロアの略奪者　ＤＬ版'])
        .on('data', function(entry: any) {
          console.log(entry.key)
          console.log(entry.data)
        })
    }
    const styles = useStyles()
    const { next, back, goHome, goDetail } = useRouteStack(routeIndex, routeStack)
    const setGame = (selectGame: Game) => {
      game.value = selectGame
      goDetail(selectGame.id)
    }
    return {
      onClick,
      styles,
      routeIndex,
      routeStack,
      game,
      games,
      next,
      back,
      goHome,
      goDetail,
      setGame
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