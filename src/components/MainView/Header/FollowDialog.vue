<template>
  <q-dialog v-model="isOpen" @before-hide="close" >
    <q-card style="width: 390px" :class="$style.cardContainer" >
      <q-card-section>
        <div class="text-h6">フォロー</div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <q-tabs
            v-model="tab"
            narrow-indicator
            dense
            align="justify"
          >
            <q-tab class="text-blue" name="box" icon="move_to_inbox"  />
            <q-tab class="text-blue" name="send" icon="send" />
            <q-tab class="text-blue" name="followees" icon="loyalty" />
            <q-tab class="text-blue" name="followers" icon="people_alt" />
          </q-tabs>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <follow-box-item v-if="tab === 'box'" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import FollowBoxItem from './FollowBoxItem.vue'

export default defineComponent({
  name: 'FollowDialog',
  props: {
    isOpen: {
      type: Boolean, required: true
    },
  },
  components: { FollowBoxItem },
  setup(props, context) {
    const close = () => {
      context.emit('close')
    }
    const tab = ref('box')
    return { close, tab }
  }
});
</script>

<style lang="scss" module>
.cardContainer {
  padding: 8px;
  height: 70%;
}
</style>
