<template>
  <div v-if="!game">Error</div>
  <q-scroll-area v-else :style="styles.container">
    <div :class="$style.container">
      <img :class="$style.image" :src="game.imgUrl" />
      <div :class="$style.wrapTitle">
        <div :class="$style.title">{{ game.name }}</div>
        <div :class="$style.titleInfo"><div>{{ game.brandName }}</div></div>
        <div :class="$style.titleInfo"><div>({{ game.sellday }})</div></div>
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
    MainWrapper
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
    return { game, styles, createList }
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