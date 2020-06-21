<template>
  <div>
    <q-dialog v-model="isOpen" @before-hide="close">
      <q-card style="width: 400px" :class="$style.container">
        <q-card-section>
          <div class="text-h6">設定</div>
        </q-card-section>
        <q-item dense>
          <q-item-section>
            <q-toggle
              :class="$style.checkbox"
              v-model="settings.isVerbRunAs"
              label="管理者権限での起動"
              left-label
            />    
          </q-item-section>
        </q-item>
        <q-item dense>
          <q-item-section>
            <q-btn flat style="color: black" label="探索するフォルダの設定" @click="openChangePath" />
          </q-item-section>
        </q-item>
      </q-card>
    </q-dialog>
    <change-folder-path v-if="isOpenChangePath" :isOpen="isOpenChangePath" @close="closeChangePath" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from '@vue/composition-api';
import ChangeFolderPath from '../../SideBar/ChangeFolderPath.vue'
import useJson from '../../use/useJson';

export default defineComponent({
  name: 'Setting',
  props: {
    isOpen: {
      type: Boolean, required: true
    }
  },
  components: {
    ChangeFolderPath
  },
  setup(_, context) {
    const { override, readFileConsoleErr } = useJson()
    const settings = ref<{ isVerbRunAs: boolean }>({ isVerbRunAs: false })

    onMounted(async () => {
      try {
        const settings = JSON.parse(await readFileConsoleErr('setting/setting.json'))
        settings.value = settings
      } catch (e) {
        console.error(e)
      }
    })

    const close = async () => {
      try {
        await override('setting/setting.json', JSON.stringify(settings.value))
      } catch (e) {
        console.error(e)
      }
      context.emit('close')
    }

    const isOpenChangePath = ref(false)
    const openChangePath = () => {
      isOpenChangePath.value = true
    }
    const closeChangePath = () => {
      isOpenChangePath.value = false
    }
    return { close, settings, isOpenChangePath, openChangePath, closeChangePath }
  }
});
</script>

<style lang="scss" module>
.container {
  padding: 16px;
}

.checkbox {
  justify-content: center;
  flex-direction: row !important;
}
</style>