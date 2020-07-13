<template>
  <div :class="$style.container">
    <q-btn @click="getFile" label="ファイルを選択" />
    <div>{{ displayPath }}</div>
    <q-btn :class="$style.addBtn" @click="addGames" label="ゲームを追加" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from '@vue/composition-api';
import store from 'src/store'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const remote = require('electron').remote;

export default defineComponent({
  name: 'FromCSV',
  props: {
  },
  components: {  },
  setup(props, context) {
    const path = ref('')
    const displayPath = computed(() => path.value ? `Path: ${path.value}` : 'ファイル未選択')

    const getFile = async () => {
      const dialog = remote.dialog
      const result = await dialog.showOpenDialog({
        title: 'CSVファイルの選択',
        properties: ['openFile', 'dontAddToRecent'],
        defaultPath: '.',
        filters: [{ name: 'CSV', extensions: ['csv'] }],
      })
      if (result.filePaths.length === 1) {
        path.value = result.filePaths[0]
      }
    }

    const addGames = () => {
      if (path.value) {
        context.emit('add', [path.value])
      }
    }
    return { path, displayPath, getFile, addGames }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
}

.addBtn {
  margin-top: auto;
}
</style>
