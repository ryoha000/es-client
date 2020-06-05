<template>
  <div>
    <q-btn icon="add_box" class="full-width" @click="onClick" >
      <div style="margin-left: 8px;" />
      ゲームを追加
    </q-btn>
    <add-game-dialog :allDMM="allDMM" :isOpen="isOpenDialog" @close="onCloseDialog" @addGame="addGame"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import useScraping from '../use/useScraping'
import AddGameDialog from './AddGameDialog.vue'
import { DMM } from '../../types/root';

export default defineComponent({
  name: 'AddGame',
  components: {
    AddGameDialog
  },
  props: {
    allDMM: {
      type: Object as PropType<Record<number, DMM>>,
      required: true
    }
  },
  setup(_, context) {
    const { getTitle, getGameDetail } = useScraping()
    const isOpenDialog = ref(true)
    const onClick = () => {
      isOpenDialog.value = true
    }
    const onCloseDialog = () => {
      isOpenDialog.value = false
    }
    const addGame = () => {
      context.emit('addGame')
    }
    return { onClick, isOpenDialog, onCloseDialog, addGame }
  }
});
</script>

<style lang="scss" module>

</style>