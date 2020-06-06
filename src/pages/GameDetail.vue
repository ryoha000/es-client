<template>
  <div v-if="!game">Error</div>
  <q-scroll-area v-else :style="styles.container">
    <div :class="$style.container">
      <img :class="$style.image" :src="game.imgUrl" />
      <div :class="$style.wrapTitle">
        <div :class="$style.title">{{ game.name }}</div>
        <link-c
          :title="game.brandName"
          :fontSize="20"
          :class="$style.titleInfo"
          :url="`https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/brand.php?brand=${game.brandId}`"
          :icon="false"
        />
        <link-c
          :title="`(${game.sellday})`"
          :fontSize="20"
          :class="$style.titleInfo"
          :url="createSellDayURL(game.sellday)"
          :icon="false"
        />
      </div>
    </div>
    <main-wrapper :game="game" :gameInList="haveGame" :seiya="seiya" @createList="createList"/>
  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, Ref, reactive, onMounted } from '@vue/composition-api';
import MainWrapper from '../components/MainView/GameDetail/MainWrapper.vue'
import { Game, Record, ListGame, List } from '../types/root';
import { makeStyles } from '../lib/style'
import LinkC from '../components/MainView/GameDetail/Link.vue'

const useStyles = (windowHeight: Ref<number>) => 
  reactive({
    container: makeStyles(theme => ({
        height: `calc( ${windowHeight.value}px - 52px )`
      })
    )
  })


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
    haveGame: {
      type: Object as PropType<Record<number, ListGame>>,
      required: true
    },
    seiya: {
      type: Object as PropType<{createdNow: number, games: {name: string, url: string}}[]>,
      required: true
    },
    lists: {
      type: Array as PropType<List[]>,
      default: []
    }
  },
  components: {
    MainWrapper,
    LinkC
  },
  setup(props, context) {
    const game = computed(() => {
      console.log(props.games[props.id], props.games, props.id)
      return props.games[props.id]
    })
    const windowHeight = ref(window.innerHeight)
    const styles = useStyles(windowHeight)
    onMounted(() => {
      window.addEventListener('resize', () => {
        windowHeight.value = window.innerHeight
      })
    })
    const createList = () => {
      context.emit('createList')
    }
    const createSellDayURL = (sellday: string) => {
      const [year, month, day] = sellday.split('-')
      return `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_hatubaibi_month.php?year=${year}&month=${month}#${sellday}`
    }
    return { game, styles, createList, createSellDayURL }
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
  // font-size: 20px;
  margin-left: 16px;
  // color: #0366d6;
  // cursor: pointer;
  // :hover {
  //   color: navy;
  //   border-bottom: thin solid navy;
  // }
}
</style>