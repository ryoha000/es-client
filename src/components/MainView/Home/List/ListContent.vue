<template>
  <div>
    <q-expansion-item
      expand-separator
      :class="$style.container"
      :label="list.list.name"
      @show="openToggle"
    >
      <div :class="$style.gameCards" >
        <q-card dark :class="$style.cContainer" v-if="!isLoading">
          <q-btn icon="add" label="ゲームを追加" stack size="xl" :class="$style.addButton" @click="openAddGameDialog"/>
        </q-card>
        <game-card :cardInfo="createCardInfo(game)" :class="$style.gameCard" v-for="(game, i) in list.games" :key="i"/>
      </div>
    </q-expansion-item>
    <add-game-to-list-dialog :isOpen="isOpenAddGameDialog" @close="closeAddGameDialog" v-if="isOpenAddGameDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, PropType } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'
import { CardInfo } from '../../HorizontalScroll.vue'
import { Game, ListInServerWithGames } from 'src/types/root';
import AddGameToListDialog from './AddGameToListDialog.vue'
import { getListInServer } from '../../../../lib/api';
import store from 'src/store'

export default defineComponent({
  name: 'ScheduleDay',
  props: {
    list: {
      type: Object as PropType<ListInServerWithGames>,
      required: true
    }
  },
  components: { GameCard, AddGameToListDialog },
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

    const addCardClick = () => {
      console.log('addCardClick')
    }

    const onClickContent = () => {
      console.log('onClickContent')
    }

    const isOpenAddGameDialog = ref(false)
    const openAddGameDialog = () => {
      isOpenAddGameDialog.value = true
    }
    const closeAddGameDialog = () => {
      isOpenAddGameDialog.value = false
    }

    const isLoading = ref(false)
    const openToggle = async () => {
      isLoading.value = true
      await store.dispatch.domain.setLatestList(props.list.list.id)
      isLoading.value = false
    }
    return { createCardInfo, addCardClick, onClickContent, isOpenAddGameDialog, openAddGameDialog, closeAddGameDialog, isLoading, openToggle }
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
  padding-left: 16px;
  padding-top: 8px;
}
.gameCard {
  margin-right: 16px;
  margin-top: 16px;
}

.cContainer {
  max-width: 250px;
  height: 196px;
  cursor: pointer;
}
.addButton {
  width: 250px;
  height: 196px;
}
</style>
