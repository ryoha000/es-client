<template>
  <div :class="$style.container">
    <q-expansion-item
      expand-separator
      :class="$style.container"
      label="エロゲーマーアクティビティ"
      default-opened
      header-style="font-size: 20px;"
    >
      <horizontal-scroll-area>
        <template #iter>
          <div class="row no-wrap">
            <div v-for="(tl, i) in timelines" :key="i" :class="$style.card">
              <game-card :cardInfo="cardInfo_by_tl(tl)">
                <template #cardSupplement>
                  <timeline-supplement :tl="tl" />
                </template>
              </game-card>
            </div>
          </div>
        </template>
      </horizontal-scroll-area>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import store from 'src/store';
import GameCard from '../../GameCard.vue';
import { MaskedTimeline } from 'src/types/root';
import { CardInfo } from '../../HorizontalScroll.vue';
import HorizontalScrollArea from '../../HorizontalScrollArea.vue';
import TimelineSupplement from './TimelineSupplement.vue';

export default defineComponent({
  name: 'Timeline',
  components: { GameCard, HorizontalScrollArea, TimelineSupplement },
  setup() {
    const timelines = computed(() => store.state.domain.maskedTimelines);
    const cardInfo_by_tl = (tl: MaskedTimeline): CardInfo => {
      return {
        title: tl.game.gamename ?? '',
        supplement: '',
        image: `https://pics.dmm.co.jp/${tl.game.dmm_genre ?? ''}/pcgame/${tl.game.dmm ?? ''}/${tl.game.dmm ?? ''}pl.jpg`,
        // image: '',
        url: `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${tl.game.id}`
      };
    };
    return {
      timelines,
      cardInfo_by_tl
    };
  }
});
</script>

<style lang="scss" module>
.title {
  font-size: 22px;
  margin-left: 8px;
  margin-bottom: 8px;
}

.card {
  width: 260px;
  height: 250px;
  margin-right: 8px;
  overflow: hidden;
}

.container {
  width: 100%;
  margin-top: 8px;
}
</style>
