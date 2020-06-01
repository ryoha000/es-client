<template>
  <div :class="$style.container">
    <q-btn flat icon="keyboard_arrow_left"/>
    <q-btn flat icon="keyboard_arrow_right"/>
    <q-btn flat icon="home" />
    <q-input :class="$style.input" rounded outlined v-model="searchString" dark>
      <template v-slot:prepend>
        <q-icon name="search" color="white" :class="$style.icon" />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'MainViewHeader',
  props: {
  },
  components: {
  },
  setup() {
    const searchString = ref('')
    return { searchString }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  height: 36px;
  margin-left: 8px;
  margin-top: 8px;
}
.input {
  margin-left: auto;
}
</style>