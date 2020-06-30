<template>
  <div>
    <filter-game
      :class="$style.item"
      @sortByLastAccess="sortByLastAccess"
      :isSortByLastAccess="isSortByLastAccess"
      :lists="lists" @createList="createList"
      :haveGames="arrayList"
      @filter="filter"
    />
    <search :class="$style.search" @changeSearch="changeSearch" />
    <add-game :class="$style.item" @createList="createList" />
    <q-scroll-area :style="styles.scrollArea" dark>
      <game-list-item
        :class="$style.item"
        @game="setGame"
        :games="arrayList"
        :lists="lists"
        @createList="createList"
        :filterListId="filterListId"
      />
    </q-scroll-area>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, reactive, Ref, onMounted } from '@vue/composition-api';
import FilterGame from './FilterGame.vue'
import Search from './Search.vue'
import GameListItem from './GaleListItem.vue'
import AddGame from './AddGame.vue'
import { ListGame, List } from '../../types/root';
import { makeStyles } from '../../lib/style'
import store from 'src/store'
import * as fs from 'fs'

const useStyles = (height: Ref<number>) => 
  reactive({
    scrollArea: makeStyles(theme => ({
        height: `calc( ${height.value}px - 126px )`,
      })
    )
  })

export default defineComponent({
  name: 'SideBar',
  props: {
    haveGame: { type: Object as PropType<Record<number, ListGame>>, required: true },
    lists: {
      type: Array as PropType<List[]>,
      default: []
    }
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

    const searchString = ref('')
    const changeSearch = (value: string) => {
      searchString.value = value
    }

    const filterListId = ref(0)
    const filter = (v: {label: string, id: number}) => {
      filterListId.value = v.id
    }

    const windowHeight = ref(window.innerHeight)
    onMounted(() => {
      window.addEventListener('resize', () => {
        windowHeight.value = window.innerHeight
      })
    })
    const styles = useStyles(windowHeight)

    const sortByLastAccess = async () => {
      // TODO 並列
      for (const listGame of Object.entries(props.haveGame)) {
        try {
          const stats = await fs.promises.stat(listGame[1].path)
          lastAccessTime.value[listGame[1].id] = stats.birthtime
        } catch (e) {
          //console.error(e)
          continue
        }
      }
      isSortByLastAccess.value = !isSortByLastAccess.value
    }

    const minimalGames = computed(() => store.state.entities.minimalGames)

    const arrayList = computed(() => {
      //let arrayListGame = props.lists.find(v => v.id === filterListId.value)?.games ?? (Object.entries(props.haveGame)).map(v => v[1])
      let arrayListGame = props.lists.find(v => v.id === filterListId.value)?.games ?? (Object.entries(props.haveGame)).map(v => v[1])
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
      } else {
        arrayListGame.sort()
      }
      if (searchString.value !== '') {
        arrayListGame = arrayListGame.filter(v => minimalGames.value[v.id]?.gamename.toLowerCase().includes(searchString.value.toLowerCase()))
      }
      return arrayListGame
    })
    const addGame = () => {
      context.emit('addGame')
    }
    const createList = () => {
      context.emit('createList')
    }
    return { setGame, sortByLastAccess, lastAccessTime, arrayList, isSortByLastAccess, styles, addGame, changeSearch, createList, filter, filterListId }
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