<template>
  <horizontal-scroll-area>
    <template #iter>
      <div class="row no-wrap">
        <div v-for="(cardInfo, i) in cardInfos" :key="i" :class="$style.card">
          <game-card :cardInfo="cardInfo">
            <template #cardSupplement >
              <div :class="$style.supplement">{{ cardInfo.supplement }}</div>
            </template>
          </game-card>
        </div>
      </div>
    </template>
  </horizontal-scroll-area>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import GameCard from './GameCard.vue'
import HorizontalScrollArea from './HorizontalScrollArea.vue'

export interface CardInfo {
  title: string
  supplement: string
  image: string
  url?: string
  contentUrl?: string
  contain?: boolean
  tooltip?: string
}

export default defineComponent({
  name: 'HorizontalScroll',
  props: {
    cardInfos: {
      type: Array as PropType<CardInfo[]>,
      default: []
    }
  },
  components: { GameCard, HorizontalScrollArea },
  setup() {
    return { }
  }
});
</script>

<style lang="scss" module>
.card {
  width: 260px;
  height: 250px;
  margin-right: 8px;
  overflow: hidden;
}

.supplement {
  overflow: hidden;
  white-space: nowrap;
  width: 240px;
  text-overflow: ellipsis;
}
</style>