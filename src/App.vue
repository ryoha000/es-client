<template>
  <div id="q-app" :class="$style.app" :style="styles.app">
    <side-bar :class="$style.sidebar"/>
    <div :class="$style.mainview">
      <main-view-header />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import SideBar from './components/SideBar/SideBar.vue'
import MainViewHeader from './components/MainView/Header/MainViewHeader.vue'
import { defineComponent, reactive } from '@vue/composition-api'
import { makeStyles } from './lib/style'

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
    MainViewHeader
  },
  setup() {
    const onClick = () => {
      ChildProcess.spawn('powershell.exe', ['cd \'E:\\Program Files (x86)\\Whirlpool\\KUJIRA\' ; powershell Start-Process kujira.exe -verb runas'])
      // TODO: Get Icon, ref: https://github.com/mtojo/node-system-icon, require rebuild
      FS.stat('E:\\Program Files (x86)\\Whirlpool\\KUJIRA\\kujira.exe', (err, stat) => {
        console.log(stat)
      })
    }
    const styles = useStyles()
    return { onClick, styles }
  }
})
</script>

<style lang="scss" module>
.app {
  color: aliceblue;
  display: flex;
  flex-direction: row;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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