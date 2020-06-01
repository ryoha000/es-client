<template>
  <div :class="$style.container">
    <q-btn flat icon="keyboard_arrow_left" @click="back" />
    <q-btn flat icon="keyboard_arrow_right" @click="next" />
    <q-btn flat icon="home" @click="home" />
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
  setup(_, context) {
    const searchString = ref('')
    const back = () => {
      console.log('back header')
      context.emit('back')
    }
    const next = () => {
      console.log('next header')
      context.emit('next')
    }
    const home = () => {
      console.log('home header')
      context.emit('home')
    }
    return { searchString, back, next, home }
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