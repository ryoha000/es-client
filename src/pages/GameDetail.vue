<template>
  <div v-if="!game">Error</div>
  <div v-else :class="$style.container">
    <img :class="$style.image" :src="game.imgUrl" />
    <div :class="$style.wrapTitle">
      <div :class="$style.title">{{ game.name }}</div>
      <div :class="$style.titleInfo"><div>{{ game.brandName }}</div></div>
      <div :class="$style.titleInfo"><div>({{ game.sellday }})</div></div>
    </div>
    <main-wrapper :game="game" :gameInList="gameInList" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from '@vue/composition-api';
import MainWrapper from '../components/MainView/GameDetail/MainWrapper.vue'
import { Game, Record, ListGame } from '../types/root';

export default defineComponent({
  name: 'GameDetail',
  props: {
    games: {
      type: Object as PropType<Record<number, Game>>,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    gameInList: {
      type: Object as PropType<Record<number, ListGame>>,
      required: true
    }
  },
  components: {
    MainWrapper
  },
  setup(props) {
    const game = computed(() => {
      console.log(props.games[props.id], props.games, props.id)
      return props.games[props.id]
    })
    return { game }
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