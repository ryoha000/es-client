<template>
  <div :class="$style.container">
    <q-btn flat icon="keyboard_arrow_left" @click="back" :disable="routeIndex === 0" />
    <q-btn flat icon="keyboard_arrow_right" @click="next" :disable="routeStack.length === routeIndex + 1" />
    <q-btn flat icon="home" @click="home" :disable="routeStack[routeIndex].type === 'Home'"/>
    <q-input :class="$style.input" rounded outlined v-model="searchString" dark @keydown="(e) => search(e)">
      <template v-slot:prepend>
        <q-icon name="search" color="white" :class="$style.icon" />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import { StackType } from '../../../types/root';

export default defineComponent({
  name: 'MainViewHeader',
  props: {
    routeIndex: {
      type: Number ,required: true
    },
    routeStack: {
      type: Array as PropType<StackType[]>,
      required: true
    }
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
    const search = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        window.open(`https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/kensaku.php?category=game&word_category=name&word=${searchString.value}&mode=normal`)
      }
    }
    return { searchString, back, next, home, search }
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
  :nth-child(1) {
    height: 32px;
    :nth-child(1) {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>