<template>
  <div>
    <filter-game :class="$style.item" />
    <search :class="$style.item" />
    <add-game :class="$style.item"/>
    <game-list-item :class="$style.item" title="さくら、もゆ。 -as the Night's, Reincarnation-" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import FilterGame from './FilterGame.vue'
import Search from './Search.vue'
import GameListItem from './GaleListItem.vue'
import AddGame from './AddGame.vue'

export default defineComponent({
  name: 'SideBar',
  props: {
  },
  components: {
    FilterGame,
    Search,
    GameListItem,
    AddGame
  },
  setup() {
    return
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