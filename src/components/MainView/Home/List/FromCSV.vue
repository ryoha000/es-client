<template>
  <div :class="$style.container">
    <q-item>
      <q-item-section>
        <q-btn
          outline
          rounded
          @click="getFile"
          label="ファイルを選択"
          :class="$style.input"
          icon="folder_open"
        />
        <div :class="$style.text">{{ displayPath }}</div>
      </q-item-section>
    </q-item>
    <q-item :class="$style.addBtn">
      <q-item-section>
        <q-btn
          @click="addGames"
          color="primary"
          label="追加"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';

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

.input {
  width: 100%;
}

.text {
  font-size: 1.12rem;
  margin-top: 8px;
}

.addBtn {
  width: 100%;
  margin: auto;
  margin-bottom: 0;
}
</style>
