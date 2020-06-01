<template>
  <div :class="$style.container">
    <q-input
      dark
      v-model="searchString"
      square
      :class="$style.input"
    >
      <template v-slot:prepend>
        <q-icon name="search" :class="$style.icon" />
      </template>
    </q-input>
    <q-icon :class="$style.button" size="24px" name="tune"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Search',
  props: {
  },
  setup() {
    const searchString = ''
    return { searchString }
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
.input {
  width: calc( 100% - 40px );
  .icon {
    width: 16px;
    margin-right: 0;
  }
}
.button {
  margin: 8px;
  margin-left: 4px;
  margin-top: 12px;
  cursor: pointer;
}
</style>