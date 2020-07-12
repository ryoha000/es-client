<template>
  <div>
    <q-expansion-item
      expand-separator
      :class="$style.container"
      :label="list.name"
      @click.right.prevent="rightClick"
    >
      <div :class="$style.gameCards">
        <q-card dark :class="$style.cContainer">
          <q-btn icon="add" label="ゲームを追加" stack size="xl" :class="$style.addButton" @click="openAddGameDialog"/>
        </q-card>
        <game-card :cardInfo="createCardInfo(game)" :class="$style.gameCard" v-for="(game, i) in list.games" :key="i"/>
      </div>
    </q-expansion-item>
    <add-game-collection-dialog
      :isOpen="isOpenAddGameDialog"
      @close="closeAddGameDialog"
      @confirm="addGames"
      cardHeader="コレクションにゲームを追加"
      label="追加"
      :iGames="list.games"
      v-if="isOpenAddGameDialog"
    />
    <collection-arrangement-dialog
      :isOpen="isOpenCollectionArrangementDialog"
      @close="closeCollectionArrangementDialog"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'
import { List, ListGame } from 'src/types/root';
import store from 'src/store'
import AddGameCollectionDialog from 'src/components/CreateListDialog.vue'
import useJson from 'src/components/use/useJson'
import useListRightClick from '../List/use/useListRightClick';
import CollectionArrangementDialog from './CollectionArrangementList.vue'

export default defineComponent({
  name: 'ListContent',
  props: {
    list: {
      type: Object as PropType<List>,
      required: true
    }
  },
  components: { GameCard, AddGameCollectionDialog, CollectionArrangementDialog },
  setup(props) {
    const haveGames = computed(() => store.state.entities.haveGames)
    const createCardInfo = (g: ListGame) => {
      const game = haveGames.value[g.id]
      return {
        title: game?.gamename ?? '',
        supplement: 'game.brandName',
        // image: `https://pics.dmm.co.jp/${game?.dmm_genre ?? ''}/pcgame/${game?.dmm ?? ''}/${game?.dmm ?? ''}pl.jpg`,
        image: '',
        url: `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${game?.id ?? 0}`,
        contain: true
      }
    }

    const isOpenAddGameDialog = ref(false)
    const openAddGameDialog = () => {
      isOpenAddGameDialog.value = true
    }
    const closeAddGameDialog = () => {
      isOpenAddGameDialog.value = false
    }
    const { setGamesToList, removeList } = useJson()
    const addGames = async (payload: { title: string, games: ListGame[] }) => {
      await setGamesToList(props.list.id, payload.games)
    }

    const isOpenCollectionArrangementDialog = ref(false)
    const openCollectionArrangementDialog = () => {
      isOpenCollectionArrangementDialog.value = true
    }
    const closeCollectionArrangementDialog = () => {
      isOpenCollectionArrangementDialog.value = false
    }
    const rightClick = () => {
      const { setupMenuList } = useListRightClick()
      const menu = setupMenuList('コレクション', () => { console.log('edit') }, openCollectionArrangementDialog, () => { console.log('delete') })
      menu.popup()
    }
    return {
      createCardInfo,
      isOpenAddGameDialog,
      openAddGameDialog,
      closeAddGameDialog,
      addGames,
      isOpenCollectionArrangementDialog,
      closeCollectionArrangementDialog,
      rightClick,
    }
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
}
.gameCard {
  margin-right: 16px;
  margin-top: 16px;
}

.cContainer {
  max-width: 250px;
  height: 196px;
  margin-right: 16px;
  margin-top: 16px;
}
.addButton {
  width: 250px;
  height: 196px;
}
</style>
