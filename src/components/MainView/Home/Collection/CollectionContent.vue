<template>
  <div v-if="list.id !== 0">
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
      @confirm="editList"
      cardHeader="コレクションにゲームを追加"
      label="追加"
      :iGames="list.games"
      v-if="isOpenAddGameDialog"
      :isName="false"
      :iName="list.name"
    />
    <add-game-collection-dialog
      :isOpen="isOpenEditCollectionDialog"
      @close="closeEditCollectionDialog"
      @confirm="editList"
      cardHeader="コレクションを編集"
      label="確定"
      :iGames="list.games"
      v-if="isOpenEditCollectionDialog"
      :iName="list.name"
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
    const { removeList, updateOrInsertList } = useJson()
    const editList = async (payload: { title: string, games: ListGame[] }) => {
      await updateOrInsertList({ ...props.list, name: payload.title, games: payload.games })
      if (props.list.relation) {
        await store.dispatch.domain.addGames({ list_id: props.list.relation, game_ids: payload.games.map(v => v.id) })
      }
    }

    const isOpenCollectionArrangementDialog = ref(false)
    const openCollectionArrangementDialog = () => {
      isOpenCollectionArrangementDialog.value = true
    }
    const closeCollectionArrangementDialog = () => {
      isOpenCollectionArrangementDialog.value = false
    }

    const isOpenEditCollectionDialog = ref(false)
    const openEditCollectionDialog = () => {
      isOpenEditCollectionDialog.value = true
    }
    const closeEditCollectionDialog = () => {
      isOpenEditCollectionDialog.value = false
    }

    const deleteCollection = async () => {
      const result = window.confirm(`コレクション: 「${props.list.name}」を本当に削除しますか？`)
      if (result) {
        await removeList(props.list.id)
      }
    }
    const rightClick = () => {
      const { setupMenuList } = useListRightClick()
      const menu = setupMenuList('コレクション', openEditCollectionDialog, openCollectionArrangementDialog, async() => { await deleteCollection() })
      menu.popup()
    }
    return {
      createCardInfo,
      isOpenAddGameDialog,
      openAddGameDialog,
      closeAddGameDialog,
      editList,
      isOpenCollectionArrangementDialog,
      closeCollectionArrangementDialog,
      rightClick,
      isOpenEditCollectionDialog,
      closeEditCollectionDialog,
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
