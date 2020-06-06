<template>
  <div :class="$style.container">
    <q-input
      dark
      v-model="searchString"
      square
      :class="$style.input"
      @input="input"
    >
      <template v-slot:prepend>
        <q-icon name="search" :class="$style.icon" />
      </template>
    </q-input>
    <!-- <q-icon :class="$style.button" size="22px" name="tune"/> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Search',
  props: {
  },
  setup(_, context) {
    const searchString = ''
    const input = (value: string) => {
      context.emit('changeSearch', value)
    }
    return { searchString, input }
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
  width: calc( 100%);
  //width: calc( 100% - 28px );
  height: 32px;
  :nth-child(n) {
    padding: 0px;
    line-height: 32px;
    height: 32px;
    min-height: 32px !important;
  }
  .icon {
    width: 16px;
    margin-right: 8px;
  }
}
.button {
  margin: 8px;
  margin-left: 4px;
  margin-top: 12px;
  cursor: pointer;
}
</style>