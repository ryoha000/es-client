<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px" :class="$style.cardWrapper">
      <q-card-section>
        <div class="text-h6">探索先フォルダの追加</div>
        <div class="text-h8">.lnk ファイルがあるPathを指定してください</div>
        <div class="text-h8">追加後は「新しく追加されたものを探す」で探索できます</div>
        <div class="text-h8">必ず読み込むのは以下のPathです</div>
        <code>C:\ProgramData\Microsoft\Windows\Start Menu\Programs</code><br>
        <code>C:\Users\{UserName}\AppData\Roaming\Microsoft\Windows\Start Menu\Programs</code>
      </q-card-section>
      <q-item v-for="(path, i) in paths" :key="i">
        <q-item-section>
          <div :class="$style.input">
            <q-input :value="path" @input="(value) => input(value, i)" />
            <q-btn flat round icon="close" @click="dicreaseRow(i)" />
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-btn flat :class="$style.addBtn" round icon="add" @click="addRow" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-btn color="primary" label="確定" @click="addPath"/>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import useJson from '../use/useJson';

export default defineComponent({
  name: 'ChangeFolderPath',
  props: {
    isOpen: {
      type: Boolean, required: true
    }
  },
  setup(props, context) {
    const paths = ref<string[]>([''])
    const close = () => {
      paths.value = ['']
      context.emit('close')
    }
    const input = (value: string, i: number) => {
      paths.value = paths.value.map((v, ind) => {
        if (ind === i) return value
        else return v
      })
    }
    const addRow = () => {
      paths.value.push('')
    }
    const dicreaseRow = (i: number) => {
      paths.value.splice(i, 1)
    }
    const addPath = async () => {
      const { override } = useJson()
      await override('setting/folder.json', JSON.stringify(paths.value))
      close()
    }
    onMounted(async() => {
      const { readFileConsoleErr } = useJson()
      try {
        const jsonPaths = JSON.parse(await readFileConsoleErr('setting/folder.json'))
        const prevPaths: string[] = []
        if (Array.isArray(jsonPaths)) {
          for (const jsonPath of jsonPaths) {
            if (typeof jsonPath === 'string') {
              if (jsonPath === '') continue
              prevPaths.push(jsonPath)
            }
          }
          paths.value = [...prevPaths, '']
        }
      } catch {
      }
    })
    return { close, paths, input, addRow, dicreaseRow, addPath }
  }
});
</script>

<style lang="scss" module>
.input {
  display: flex;
  :first-child {
    width: 320px;
  }
  :nth-child(2) {
    width: 42px;
    height: 42px;
  }
}
.addBtn {
  margin: 0 auto;
  width: 42px;
}
</style>
