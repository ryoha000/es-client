<template>
  <div v-if="!gameDetail">nowloading</div>
  <q-scroll-area v-else :style="styles.container">
    <div :class="$style.container">
      <img :class="$style.image" :src="imgUrl" />
      <div :class="$style.wrapTitle">
        <div :class="$style.title">{{ gameDetail.name }}</div>
        <link-c
          :title="gameDetail.brandName"
          :fontSize="20"
          :class="$style.titleInfo"
          :url="`https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/brand.php?brand=${gameDetail.brandId}`"
          :icon="false"
        />
        <link-c
          :title="`(${gameDetail.sellday})`"
          :fontSize="20"
          :class="$style.titleInfo"
          :url="createSellDayURL(gameDetail.sellday)"
          :icon="false"
        />
      </div>
    </div>
    <main-wrapper />
  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref, reactive, onMounted } from '@vue/composition-api';
import MainWrapper from '../components/MainView/GameDetail/MainWrapper.vue'
import { makeStyles } from '../lib/style'
import LinkC from '../components/MainView/GameDetail/Link.vue'
import store from 'src/store'

const useStyles = (windowHeight: Ref<number>) => 
  reactive({
    container: makeStyles(() => ({
        height: `calc( ${windowHeight.value}px - 52px )`
      })
    )
  })

export default defineComponent({
  name: 'GameDetail',
  props: {
  },
  components: {
    MainWrapper,
    LinkC
  },
  setup() {
    const gameDetail = computed(() => store.state.domain.gameDetail)
    const imgUrl = computed(() => store.state.domain.gameDetail?.imgUrl ?? '')
    const windowHeight = ref(window.innerHeight)
    const styles = useStyles(windowHeight)
    onMounted(() => {
      window.addEventListener('resize', () => {
        windowHeight.value = window.innerHeight
      })
    })
    const createSellDayURL = (sellday: string) => {
      const [year, month] = sellday.split('-')
      return `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_hatubaibi_month.php?year=${year}&month=${month}#${sellday}`
    }
    return { gameDetail, styles, createSellDayURL, imgUrl }
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