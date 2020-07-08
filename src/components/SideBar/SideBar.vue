<template>
  <div>
    <filter-game
      :class="$style.item"
      @sortByLastAccess="sortByLastAccess"
      :isSortByLastAccess="isSortByLastAccess"
      @filter="filter"
    />
    <search :class="$style.search" @changeSearch="changeSearch" />
    <add-game :class="$style.item" />
    <q-scroll-area :style="styles.scrollArea" dark>
      <game-list-item
        :class="$style.item"
        @game="setGame"
        :games="arrayList"
        :filterListId="filterListId"
      />
    </q-scroll-area>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, Ref, onMounted } from '@vue/composition-api';
import FilterGame from './FilterGame.vue'
import Search from './Search.vue'
import GameListItem from './GaleListItem.vue'
import AddGame from './AddGame.vue'
import { makeStyles } from '../../lib/style'
import store from 'src/store'

const useStyles = (height: Ref<number>) => 
  reactive({
    scrollArea: makeStyles(() => ({
        height: `calc( ${height.value}px - 126px )`,
      })
    )
  })

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
  setup(props, context) {
    const setGame = (id: number) => {
      context.emit('game', id)
    }
    const filterListId = ref(0)
    const isSortByLastAccess = ref(false)
    const lastAccessTime = ref<Record<number, Date>>({})

    const arrayList = computed(() => store.getters.app.getSortedAndFilterdGameList(filterListId.value, isSortByLastAccess.value, searchString.value) ?? [])

    const filter = (v: {label: string, id: number}) => {
      filterListId.value = v.id
    }

    const searchString = ref('')
    const changeSearch = (value: string) => {
      searchString.value = value
    }

    const windowHeight = ref(window.innerHeight)
    onMounted(() => {
      window.addEventListener('resize', () => {
        windowHeight.value = window.innerHeight
      })
    })
    const styles = useStyles(windowHeight)

    const sortByLastAccess = () => {
      isSortByLastAccess.value = !isSortByLastAccess.value
    }
    
    return { setGame, sortByLastAccess, lastAccessTime, arrayList, isSortByLastAccess, styles, changeSearch, filter, filterListId }
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
.search {
  margin-top: 0px;
  margin-left: 8px;
}
</style>