<template>
  <div>
    <filter-game :class="$style.item" @sortByLastAccess="sortByLastAccess" :isSortByLastAccess="isSortByLastAccess" />
    <search :class="$style.item" />
    <add-game :class="$style.item"/>
    <game-list-item :class="$style.item" @game="setGame" :games="arrayList" :allGames="games"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from '@vue/composition-api';
import FilterGame from './FilterGame.vue'
import Search from './Search.vue'
import GameListItem from './GaleListItem.vue'
import AddGame from './AddGame.vue'
import { ListGame, Game, DMM } from '../../types/root';
import * as fs from 'fs'

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
  setup(props, context) {
    const setGame = (id: number) => {
      context.emit('game', id)
    }
    const isSortByLastAccess = ref(false)
    const lastAccessTime = ref<Record<number, Date>>({})
    const sortByLastAccess = async () => {
      // TODO 並列
      for (const listGame of Object.entries(props.gameInList)) {
        try {
          const stats = await fs.promises.stat(listGame[1].path)
          console.log(stats.birthtime)
          lastAccessTime.value[listGame[1].id] = stats.birthtime
        } catch (e) {
          console.error(e)
          continue
        }
      }
      isSortByLastAccess.value = !isSortByLastAccess.value
    }
    const arrayList = computed(() => {
      const arrayListGame = Object.entries(props.gameInList).map(v => v[1])
      if (isSortByLastAccess.value) {
        arrayListGame.sort((a, b) => {
          const aTime = lastAccessTime.value[a.id]
          const bTime = lastAccessTime.value[b.id]
          if (!aTime && !bTime) {
            return 0
          } else if (!aTime) {
            return 1
          } else if (!bTime) {
            return -1
          } else {
            return aTime > bTime ? -1 : 1
          }
        })
      }
      return arrayListGame
    })
    return { setGame, sortByLastAccess, lastAccessTime, arrayList, isSortByLastAccess }
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