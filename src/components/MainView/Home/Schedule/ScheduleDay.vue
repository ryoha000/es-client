<template>
  <div :class="$style.container">
    <div :class="$style.day">
      <span :class="$style.sellday">2020-5-29 (12)</span>
      <q-icon name="keyboard_arrow_down" :class="$style.icon" size="24px"/>
    </div>
    <div :class="$style.gameCards">
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
      <game-card :cardInfo="demo" :class="$style.gameCard"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'
import { CardInfo } from '../../HorizontalScroll.vue'

export default defineComponent({
  name: 'ScheduleDay',
  props: {
  },
  components: { GameCard },
  setup() {
    const demo: Ref<CardInfo> = ref({
      title: '美少女万華鏡 -理と迷宮の少女-',
      supplement: '5本5,000円まとめ買いキャンペーン!!',
      //image: 'https://trap.jp/assets/logo/icon_blue.svg?v=3da93e42ac',
      image: '../../assets/ESClient_demo_image.jpg'
    })
    return { demo }
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