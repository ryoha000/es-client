<template>
  <div v-if="!game">Error</div>
  <div v-else :class="$style.container">
    <img :class="$style.image" :src="game.imgUrl" />
    <div :class="$style.wrapTitle">
      <div :class="$style.title">{{ game.name }}</div>
      <div :class="$style.titleInfo"><div>{{ game.brandName }}</div></div>
      <div :class="$style.titleInfo"><div>({{ game.sellday }})</div></div>
    </div>
    <main-wrapper :game="game" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import MainWrapper from '../components/MainView/GameDetail/MainWrapper.vue'
import { Game } from '../types/root';

export default defineComponent({
  name: 'GameDetail',
  props: {
    game: {
      type: Object as PropType<Game | null>,
      required: true
    }
  },
  components: {
    MainWrapper
  },
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
}
.image {
  align-self: center;
}
.wrapTitle {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
}
.title {
  font-size: 24px;
  margin-left: 16px;
}
.titleInfo {
  font-size: 20px;
  margin-left: 16px;
  color: #0366d6;
  cursor: pointer;
  :hover {
    color: navy;
    border-bottom: thin solid navy;
  }
}
</style>