<template>
  <div :class="$style.container">
    <div :class="$style.day">
      <span :class="$style.sellday">{{ schedule.dayAndCount }}</span>
      <q-icon name="keyboard_arrow_down" :class="$style.icon" size="24px"/>
    </div>
    <div :class="$style.gameCards" >
      <game-card :cardInfo="createCardInfo(game)" :class="$style.gameCard" v-for="(game, i) in schedule.games" :key="i"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, PropType } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'
import { CardInfo } from '../../HorizontalScroll.vue'
import { SellSchedule } from '../../../../types/root';

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
    const createCardInfo = (game: {id: number, name: string, brandId: number, brandName: string, isMasterup: boolean, image: string}) => {
      return {
        title: game.name,
        supplement: game.brandName,
        image: game.image,
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
}
.day {
  width: 90%;
  border-bottom: medium solid aliceblue;
  display: flex;
}
.sellday {
  font-size: 20px;
  margin-left: 8px;
  margin-bottom: 4px;
}
.icon {
  margin: auto 8px 2px auto;
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