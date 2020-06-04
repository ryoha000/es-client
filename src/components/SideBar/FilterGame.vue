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
      :color="isSortByLastAccess ? 'blue' : 'snow'"
      @click="sortAccessTime"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'FilterGame',
  props: {
    isSortByLastAccess: {
      type: Boolean, required: true
    }
  },
  setup(props, context) {
    const model = ref(null)
    const options = ref([
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ])
    const sortAccessTime = () => {
      context.emit('sortByLastAccess')
    }
    return { model, options, sortAccessTime }
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
  cursor: pointer;
}
</style>
