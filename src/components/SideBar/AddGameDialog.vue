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
          <q-btn flat style="color: black" label="新しく追加されたものを探す(推奨)" @click="diff" :disable="loading" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-btn flat style="color: black" label="フォルダを探索しなおす(非常に重いです)" @click="all" :disable="loading" />
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
            <q-input v-model="url" label="ErogameScape URL" />
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
import { defineComponent, ref, PropType } from '@vue/composition-api';
import useJudgeGame from '../use/useJudgeGame'
import { DMM, ListGame } from '../../types/root';
import { remote } from 'electron'
import useJson from '../use/useJson';
import useGetFileIcon from '../use/useGetFileIcon';
import ChangeFolderPath from './ChangeFolderPath.vue'

export default defineComponent({
  name: 'AddGameDialog',
  props: {
    isOpen: {
      type: Boolean, required: true
    },
    allDMM: {
      type: Object as PropType<Record<number, DMM>>,
      required: true
    }
  },
  components: {
    ChangeFolderPath
  },
  setup(props, context) {
    const loading = ref(false)
    const isAddSelf = ref(false)
    const close = () => {
      loading.value = false
      isAddSelf.value = false
      isOpenChangePath.value = false
      url.value = ''
      path.value = ''
      context.emit('close')
    }
    const diff = async () => {
      const { searchDifference } = useJudgeGame(props.allDMM)
      loading.value = true
      const newGames = await searchDifference()
      context.emit('createList')
      loading.value = false
      let message = ''
      for (const g of newGames) {
        message += `${props.allDMM[g.id].name}, `
      }
      message += 'が追加されました'
      if (newGames.length === 0) {
        message = '追加されたゲームはありません'
      }
      alert(message)
      context.emit('close')
    }
    const all = async () => {
      const { searchAll } = useJudgeGame(props.allDMM)
      loading.value = true
      const games = await searchAll()
      context.emit('createList')
      loading.value = false
      context.emit('close')
    }
    const url = ref('')
    const path = ref('')
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
      const { addGameToList } = useJson()
      const { getIcon } = useGetFileIcon()
      if (!url.value.startsWith('https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=')) {
        alert('正しいURLを入力してください\n例) https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=26000')
        return
      }
      try {
        const id = +(url.value.replace('https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=', '')).replace('#ad', '')
        try {
          loading.value = true
          const game: ListGame = (await getIcon([{id: id, path: path.value}]))[0]
          await addGameToList(0, game)
          alert(`${props.allDMM[game.id].name}を追加しました`)
        } catch (e) {
          const game: ListGame = {id: id, path: path.value, icon: ''}
          await addGameToList(0, game)
          alert(`${props.allDMM[game.id].name}を追加しました`)
        } finally {
          loading.value = false
          isAddSelf.value = false
          url.value = ''
          path.value = ''
          context.emit('createList')
          context.emit('close')
        }
      } catch (e) {
        console.error(e)
        alert('正しいURLを入力してください\n例) https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=26000')
      }
    }
    const isOpenChangePath = ref(false)
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
