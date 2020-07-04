<template>
  <div>
    <q-btn icon="add_box" class="full-width" @click="onClick" >
      <div style="margin-left: 8px;" />
      ゲームを追加
    </q-btn>
    <add-game-dialog :isOpen="isOpenDialog" @close="onCloseDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import AddGameDialog from './AddGameDialog.vue'

export default defineComponent({
  name: 'AddGame',
  components: {
    AddGameDialog
  },
  props: {
  },
  setup() {
    const isOpenDialog = ref(false)
    const onClick = () => {
      // websocket
        const socket = new WebSocket('ws://localhost:8088/api/ws/');
        socket.addEventListener('open', function (event) {
          socket.send('Hello Server!');
        });
        socket.addEventListener('message', function (event) {
          console.log('Message from server ', event.data);
        });
      isOpenDialog.value = true
    }
    const onCloseDialog = () => {
      isOpenDialog.value = false
    }
    return { onClick, isOpenDialog, onCloseDialog }
  }
});
</script>

<style lang="scss" module>

</style>