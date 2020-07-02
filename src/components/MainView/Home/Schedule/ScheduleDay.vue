<template>
  <q-expansion-item
    expand-separator
    :class="$style.container"
    :label="schedule.day"
    default-opened
  >
    <div :class="$style.gameCards" >
      <game-card :cardInfo="createCardInfo(game)" :class="$style.gameCard" v-for="(game, i) in schedule.games" :key="i"/>
    </div>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, PropType } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'
import { CardInfo } from '../../HorizontalScroll.vue'
import { SellSchedule, GameWithoutNum } from '../../../../types/root';

export default defineComponent({
  name: 'ScheduleDay',
  props: {
    schedule: {
      type: Object as PropType<SellSchedule>,
      required: true
    }
  },
  components: { GameCard },
  setup() {
    const demo: Ref<CardInfo> = ref({
      title: '美少女万華鏡 -理と迷宮の少女-',
      supplement: '5本5,000円まとめ買いキャンペーン!!',
      //image: 'https://trap.jp/assets/logo/icon_blue.svg?v=3da93e42ac',
      image: '../../statics/icons/ESClient_demo_image.jpg',
      url: 'https://www.dlsite.com/maniax/campaign/matome202005'
    })
    const createCardInfo = (game: GameWithoutNum) => {
      return {
        title: game.gamename,
        supplement: 'game.brandName',
        // image: `https://pics.dmm.co.jp/${game.dmm_genre ?? ''}/pcgame/${game.dmm ?? ''}/${game.dmm ?? ''}pl.jpg`,
        image: '',
        url: `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${game.id}`,
        contain: true
      }
    }
    return { demo, createCardInfo }
  }
});
</script>

<style lang="scss" module>
.container {
  width: 100%;
  font-size: 20px;
}
.gameCards {
  display: flex;
  flex-wrap: wrap;
}
.gameCard {
  margin-right: 16px;
  margin-top: 16px;
}
</style>