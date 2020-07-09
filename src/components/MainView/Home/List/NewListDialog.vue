<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">新しいコレクションの作成</div>
      </q-card-section>
      <q-item dense>
        <q-item-section> </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import store from 'src/store';

export default defineComponent({
  name: 'NewListDialog',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  setup(props, context) {
    const close = () => {
      context.emit('close');
    };
    return { close };
  }
});
</script>

<style lang="scss" module></style>
