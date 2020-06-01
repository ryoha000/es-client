<template>
  <div :class="$style.container">
    <q-avatar  size="32px">
      <img src="https://cdn.quasar.dev/img/avatar5.jpg">
    </q-avatar>
    <span>{{ title }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'GameListItem',
  props: {
    title: { type: String, required: true }
  },
  components: {
  },
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  align-items: center;
}

.title {
  font-size: 24px;
}
</style>