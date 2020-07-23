<template>
  <q-expansion-item
    expand-separator
    :class="$style.expansionContainer"
    :label="list.name"
    @show="showGames"
  >
    <div :class="$style.gameCards" v-if="!isLoadingGames">
      <game-card :cardInfo="createCardInfo(game)" :class="$style.gameCard" v-for="(game, i) in games" :key="i"/>
    </div>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import { Game, ListInServer } from '../../types/root';
import UserDialogActivityItem from './UserDialogActivityItem.vue'
import GameCard from 'src/components/MainView/GameCard.vue'
import { getListInServer } from '../../lib/api';

export default defineComponent({
  name: 'UserDialogListContent',
  props: {
    list: {
      type: Object as PropType<ListInServer>,
      required: true,
    }
  },
  components: { UserDialogActivityItem, GameCard },
  setup(props) {
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

    const games = ref<Game[]>([])

    const isLoadingGames = ref(true)

    const showGames = async () => {
      isLoadingGames.value = true
      games.value = (await getListInServer(props.list.id)).games
      isLoadingGames.value = false
    }
    return { games, isLoadingGames, showGames, createCardInfo }
  }
});
</script>

<style lang="scss" module>
.expansionContainer {
  width: 100%;
  font-size: 20px;
}

.gameCards {
  display: flex;
  flex-wrap: wrap;
  padding-left: 16px;
}

.gameCard {
  margin-right: 16px;
  margin-top: 16px;
}
</style>
