<template>
  <div>
    <q-btn icon="add_box" class="full-width" @click="onClick" >
      <div style="margin-left: 8px;" />
      ゲームを追加
    </q-btn>
    <add-game-dialog :isOpen="isOpenDialog" @close="onCloseDialog" @createList="createList"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import useScraping from '../use/useScraping'
import AddGameDialog from './AddGameDialog.vue'
import store from 'src/store'

export default defineComponent({
  name: 'AddGame',
  components: {
    AddGameDialog
  },
  props: {
  },
  setup(_, context) {
    const { getTitle, getGameDetail } = useScraping()
    const isOpenDialog = ref(false)
    const onClick = async () => {
      console.log(Object.values(store.state.entities.haveGames))
      try {

        await store.dispatch.entities.setHaveGames()
      } catch (e) { console.error(e) }
      
      isOpenDialog.value = true
    }
    const onCloseDialog = () => {
      isOpenDialog.value = false
    }
    const createList = () => {
      context.emit('createList')
    }
    return { onClick, isOpenDialog, onCloseDialog, createList }
  }
});
</script>

<style lang="scss" module>

</style>