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
import * as fs from 'fs'

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

    const haveGames = computed(() => store.getters.app.getListById(0))
    const arrayList = ref(haveGames.value?.games.map(v => v) ?? [])

    const minimalGames = computed(() => store.state.entities.minimalGames)
    const filteredList = computed(() => store.getters.app.getListById(filterListId.value))

    const isSortByLastAccess = ref(false)
    const lastAccessTime = ref<Record<number, Date>>({})

    const filterListId = ref(0)
    const filter = (v: {label: string, id: number}) => {
      filterListId.value = v.id
    }

    const searchString = ref('')
    const changeSearch = (value: string) => {
      searchString.value = value
      if (value !== '') {
        arrayList.value = filteredList.value?.games.filter(v => {
          const gamename = minimalGames.value[v.id]?.gamename
          return gamename.toLowerCase().includes(value.toLowerCase())
        }) ?? []
      } else {
        arrayList.value = filteredList.value?.games ?? []
      }
    }

    const windowHeight = ref(window.innerHeight)
    onMounted(() => {
      window.addEventListener('resize', () => {
        windowHeight.value = window.innerHeight
      })
    })
    const styles = useStyles(windowHeight)

    const haveGameDetails = computed(() => store.state.entities.haveGames)
    const sortByLastAccess = async () => {
      if (!haveGames.value) return
      if (Object.values(lastAccessTime.value).length === 0) {
        // TODO 並列
        for (const listGame of haveGames.value.games) {
          try {
            const stats = await fs.promises.stat(listGame.path)
            lastAccessTime.value[listGame.id] = stats.birthtime
          } catch (e) {
            //console.error(e)
            continue
          }
        }
      }
      if (!isSortByLastAccess.value) {
        arrayList.value.sort((a, b) => {
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
        arrayList.value.sort((a, b) => {
          return ((haveGameDetails.value[`${a.id}`]?.furigana ?? '') < (haveGameDetails.value[`${b.id}`]?.furigana ?? '')) ? -1 : 1
        })
      }
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