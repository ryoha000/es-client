<template>
  <div :class="$style.container">
    <q-btn-dropdown
      split
      color="indigo-9"
      push
      no-caps
    >
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left name="play_arrow" />
          <div class="text-center">
            Play
          </div>
        </div>
      </template>

      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Photos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PlayButton',
  props: {
  },
  components: {},
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
}
</style>