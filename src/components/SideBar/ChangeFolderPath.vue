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
      <add-input-row :initialStrs="paths" label="確定" @confirm="addPath" v-if="!isLoading" />
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import AddInputRow from 'src/components/AddInputRow.vue'
import useJson from '../use/useJson';

export default defineComponent({
  name: 'ChangeFolderPath',
  props: {
    isOpen: {
      type: Boolean, required: true
    }
  },
  components: {
    AddInputRow
  },
  setup(props, context) {
    const paths = ref<string[]>([''])
    const close = () => {
      paths.value = ['']
      context.emit('close')
    }
    const addPath = async (strs: string[]) => {
      const { override } = useJson()
      await override('setting/folder.json', JSON.stringify(strs))
      close()
    }

    const isLoading = ref(true)
    onMounted(async() => {
      isLoading.value = true
      const { readFileConsoleErr } = useJson()
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      } catch (e) {
        console.error(e)
      } finally {
        isLoading.value = false
      }
    })
    return { close, paths, addPath, isLoading }
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
