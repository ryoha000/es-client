<template>
  <q-expansion-item
    expand-separator
    :class="$style.container"
    :label="schedule.day + '  (' + schedule.games.length + '本)'"
    default-opened
  >
    <div :class="$style.gameCards" >
      <game-card :cardInfo="createCardInfo(game)" :class="$style.gameCard" v-for="(game, i) in schedule.games" :key="i"/>
    </div>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'
import { SellSchedule, Game } from '../../../../types/root';

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
    const createCardInfo = (game: Game) => {
      return {
        title: game.gamename,
        supplement: 'game.brandName',
        // image: `https://pics.dmm.co.jp/${game.dmm_genre ?? ''}/pcgame/${game.dmm ?? ''}/${game.dmm ?? ''}pl.jpg`,
        image: '',
        url: `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${game.id}`,
        contain: true
      }
    }
    return { createCardInfo }
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
  padding-left: 8px;
}
.gameCard {
  margin-right: 16px;
  margin-top: 16px;
}
</style>