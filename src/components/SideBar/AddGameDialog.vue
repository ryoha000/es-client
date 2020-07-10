<template>
  <q-dialog v-model="isOpen" @before-hide="close" :persistent="loading">
    <q-card style="width: 400px" :class="$style.cardWrapper">
      <q-card-section>
        <div :class="$style.cardHeader">
          <div class="text-h6">ゲームを追加</div>
          <q-btn flat icon="settings" @click="openChangePath" :class="$style.cardIcon" />
        </div>
      </q-card-section>
      <q-item dense>
        <q-item-section>
          <q-btn flat style="color: black" label="新しく追加されたものを探す(推奨、初回激重)" @click="diff" :disable="loading" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-btn flat style="color: black" label="フォルダを探索しなおす(激重)" @click="all" :disable="loading" />
          </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-btn flat style="color: black" label="自分で実行ファイルとゲームを指定して追加する" @click="addSelf" :disable="loading" />
          </q-item-section>
      </q-item>
      <q-item v-if="isAddSelf">
        <q-item-section>
            <div>Path: {{path}}</div>
          </q-item-section>
      </q-item>
      <q-item v-if="isAddSelf">
        <q-item-section>
            <q-input v-model="url" label="ErogameScape URL or game id" />
          </q-item-section>
      </q-item>
      <q-item v-if="isAddSelf">
        <q-item-section>
            <q-btn @click="add" color="primary" label="追加" />
          </q-item-section>
      </q-item>
      <q-item :class="$style.loading" :style="loading ? 'z-index: 3' : 'z-index: -1'" >
        <q-item-section>
          <q-spinner
            color="primary"
            size="3em"
          />
        </q-item-section>
      </q-item>
    </q-card>
    <change-folder-path v-if="isOpenChangePath" :isOpen="isOpenChangePath" @close="closeChangePath" />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import useJudgeGame from '../use/useJudgeGame'
import { ListGame } from '../../types/root';
import { remote } from 'electron'
import useJson from '../use/useJson';
import useGetFileIcon from '../use/useGetFileIcon';
import ChangeFolderPath from './ChangeFolderPath.vue'
import store from 'src/store'

export default defineComponent({
  name: 'AddGameDialog',
  props: {
    isOpen: {
      type: Boolean, required: true
    },
  },
  components: {
    ChangeFolderPath
  },
  setup(props, context) {
    const loading = ref(false)
    const isAddSelf = ref(false)
    const isOpenChangePath = ref(false)
    const url = ref('')
    const path = ref('')
    const close = () => {
      loading.value = false
      isAddSelf.value = false
      isOpenChangePath.value = false
      url.value = ''
      path.value = ''
      context.emit('close')
    }

    const minimalGames = computed(() => store.state.entities.minimalGames)
    const { searchDifference, searchAll } = useJudgeGame(minimalGames.value)

    const diff = async () => {
      loading.value = true
      const newGames = await searchDifference()
      await store.dispatch.entities.setHaveGames()
      await store.dispatch.app.setAccessTimeMap()
      loading.value = false
      let message = ''
      for (const g of newGames) {
        message += `${minimalGames.value[g.id].gamename}\n`
      }
      if (newGames.length === 0) {
        message = '追加されたゲームはありません'
      }
      await remote.dialog.showMessageBox({ title: '追加されたゲーム', message: message })
      close()
    }
    const all = async () => {
      loading.value = true
      try {
        const newGames = await searchAll()
        await store.dispatch.entities.setHaveGames()
        await store.dispatch.app.setAccessTimeMap()
      } catch (e) {
        console.error(e)
      }
      loading.value = false
      close()
    }
    const addSelf = async () => {
      isAddSelf.value = true
      const dialog = remote.dialog
      const result = await dialog.showOpenDialog({
        title: '実行ファイルの選択',
        properties: ['openFile', 'dontAddToRecent'],
        defaultPath: '.'
      })
      if (result.canceled) {
        isAddSelf.value = false
        return
      }
      path.value = result.filePaths[0]
    }
    const add = async () => {
      if (url.value.length === 0) {
        remote.dialog.showErrorBox('正しいURLまたはidを入力してください', '例) https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=26000')
        return
      }
      const { addGameToList } = useJson()
      const { getIcon } = useGetFileIcon()
      const num = +(url.value)
      if (!url.value.startsWith('https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=') && isNaN(num)) {
        remote.dialog.showErrorBox('正しいURLまたはidを入力してください', '例) https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=26000')
        return
      }
      try {
        let id = 0
        const parsedUrl = +(url.value.replace('https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=', '')).replace('#ad', '')
        if (!isNaN(num)) {
          id = num
        } else if (!isNaN(parsedUrl)) {
          id = parsedUrl
        } else {
          remote.dialog.showErrorBox('正しいURLまたはidを入力してください', '例) https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=26000')
          return
        }
        try {
          if (!minimalGames.value[id].gamename) {
            throw('idが正しくありません')
          }
          loading.value = true
          const game: ListGame = (await getIcon([{id: id, path: path.value}]))[0]
          await addGameToList(0, game)
          alert(`${minimalGames.value[game.id].gamename}を追加しました`)
        } catch (e) {
          if (!minimalGames.value[id].gamename) {
            throw('idが正しくありません')
          }
          const game: ListGame = {id: id, path: path.value, icon: ''}
          await addGameToList(0, game)
          alert(`${minimalGames.value[game.id].gamename}を追加しました`)
        } finally {
          close()
        }
      } catch (e) {
        console.error(e)
        remote.dialog.showErrorBox('正しいURLまたはidを入力してください', '例) https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=26000')
        return
      }
    }
    const openChangePath = () => {
      isOpenChangePath.value = true
    }
    const closeChangePath = () => {
      isOpenChangePath.value = false
    }
    return { close, loading, diff, all, isAddSelf, addSelf, url, add, path, isOpenChangePath, openChangePath, closeChangePath }
  }
});
</script>

<style lang="scss" module>
.cardHeader {
  display: flex;
}
.cardIcon {
  margin-left: auto;
}
.cardWrapper {
  position: relative;
}
.loading {
  position: absolute;
  top: 40%;
  right: 170px;
}
</style>
