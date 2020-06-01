<template>
  <div :class="$style.container">
    <q-scroll-area
      horizontal
      dark
      ref="scrollRef"
      @scroll="scrollarea"
      style="height: 210px; width: 100%;"
    >
      <div class="row no-wrap">
        <div v-for="n in 10" :key="n" :class="$style.card">
          <game-card :cardInfo="demo" />
        </div>
      </div>
    </q-scroll-area>
    <q-btn :class="$style.rightButton" color="transparent" @click="onRightClick">
      <q-icon name=keyboard_arrow_right />
    </q-btn>
    <q-btn :class="$style.leftButton" color="transparent" @click="onLeftClick">
      <q-icon name=keyboard_arrow_left />
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref } from '@vue/composition-api';
import GameCard from './GameCard.vue'

export interface CardInfo {
  title: string
  supplement: string
  image: string
}

export default defineComponent({
  name: 'HorizontalScroll',
  props: {
    cardInfos: {
      type: Array as PropType<CardInfo[]>,
      default: []
    }
  },
  components: { GameCard },
  setup() {
    const demo: Ref<CardInfo> = ref({title: '美少女万華鏡 -理と迷宮の少女-', supplement: '5本5,000円まとめ買いキャンペーン!!', image: 'https://trap.jp/assets/logo/icon_blue.svg?v=3da93e42ac'})
    const scrollRef = ref<any | undefined>()
    const nowPosition = ref(0)
    const onRightClick = () => {
      scrollRef.value.setScrollPosition(nowPosition.value + 500)
    }
    const onLeftClick = () => {
      scrollRef.value.setScrollPosition(nowPosition.value - 500)
    }
    const scrollarea = (position: any) => {
      nowPosition.value = position.horizontalPosition
    }
    return {
      demo,
      onRightClick,
      onLeftClick,
      scrollRef,
      scrollarea
    }
  }
});
</script>

<style lang="scss" module>
.container {
  position: relative;
}
.card {
  width: 260px;
  height: 250px;
  margin-right: 8px;
}
.rightButton {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
}
.leftButton {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}
</style>