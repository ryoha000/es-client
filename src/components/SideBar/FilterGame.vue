<template>
  <div :class="$style.container">
    <q-select
      :class="$style.select"
      dark
      color="white"
      v-model="model"
      :options="options"
      
    />
    <q-icon
      :class="$style.icon"
      name="schedule"
      size="24px"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'FilterGame',
  props: {
  },
  setup() {
    const model = ref(null)
    const options = ref([
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ])
    return { model, options }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.select {
  width: calc( 100% - 40px );
}

.icon {
  margin: 8px;
  margin-left: 4px;
  margin-top: 12px;
}
</style>
