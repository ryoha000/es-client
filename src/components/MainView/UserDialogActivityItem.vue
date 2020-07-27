<template>
  <div :class="$style.container">
    <q-expansion-item
      expand-separator
      :class="$style.container"
      :label="label"
      default-opened
      header-style="font-size: 20px;"
    >
      <horizontal-scroll-area>
        <template #iter>
          <div class="row no-wrap">
            <div v-for="(tl, i) in timelines" :key="i" :class="$style.card">
              <game-card :cardInfo="cardInfo_by_tl(tl)" />
            </div>
          </div>
        </template>
      </horizontal-scroll-area>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import GameCard from './GameCard.vue';
import { TimelineWithGame } from 'src/types/root';
import { CardInfo } from './HorizontalScroll.vue';
import HorizontalScrollArea from './HorizontalScrollArea.vue'

export default defineComponent({
  name: 'UserDialogActivityItem',
  props: {
    label: {
      type: String, required: true,
    },
    timelines: {
      type: Array as PropType<TimelineWithGame[]>, default: [],
    }
  },
  components: { GameCard, HorizontalScrollArea },
  setup() {
    const cardInfo_by_tl = (tl: TimelineWithGame): CardInfo => {
      return {
        title: tl.game.gamename ?? '',
        supplement: '',
        image: `https://pics.dmm.co.jp/${tl.game.dmm_genre ?? ''}/pcgame/${tl.game.dmm ?? ''}/${tl.game.dmm ?? ''}pl.jpg`,
        // image: '',
        url: `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${tl.game.id}`,
      }
    }
    return {
      cardInfo_by_tl,
    }
  }
});
</script>

<style lang="scss" module>
.title {
  font-size: 22px;
  margin-left: 8px;
  margin-bottom: 8px;
}

.avater {
  justify-self: center;
  margin-right: 8px;
  align-self: center;
  cursor: pointer;
}

.card {
  width: 260px;
  height: 250px;
  margin-right: 8px;
  overflow: hidden;
}

.supplements {
  display: flex;
  align-items: center;
}

.typeIcon {
  margin-left: auto;
  z-index: 3;
}

.container {
  width: 100%;
}
</style>
