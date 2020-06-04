<template>
  <div>
    <filter-game :class="$style.item" />
    <search :class="$style.item" />
    <add-game :class="$style.item"/>
    <game-list-item :class="$style.item" @game="setGame" :games="gameInList" :allGames="games"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import FilterGame from './FilterGame.vue'
import Search from './Search.vue'
import GameListItem from './GaleListItem.vue'
import AddGame from './AddGame.vue'
import { ListGame, Game, DMM } from '../../types/root';
export default defineComponent({
  name: 'SideBar',
  props: {
    gameInList: { type: Object as PropType<Record<number, ListGame>>, required: true },
    games: { type: Object as PropType<Record<number, DMM>>, required: true }
  },
  components: {
    FilterGame,
    Search,
    GameListItem,
    AddGame
  },
  setup(_, context) {
    const setGame = (id: number) => {
      context.emit('game', id)
    }
    return { setGame }
  }
});
</script>

<style lang="scss" module>
.item {
  margin-top: 8px;
  margin-left: 8px;
  :first {
    margin-top: 0px;
  }
}
</style>