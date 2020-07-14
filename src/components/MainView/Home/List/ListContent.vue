<template>
  <div v-if="list">
    <q-expansion-item
      expand-separator
      :class="$style.container"
      :label="list.list.name"
      @show="openToggle"
      @click.right.prevent="rightClick"
    >
      <div :class="$style.gameCards" v-if="!isLoading" >
        <q-card dark :class="$style.cContainer">
          <q-btn icon="add" label="ゲームを追加" stack size="xl" :class="$style.addButton" @click="openAddGameDialog"/>
        </q-card>
        <game-card @click.right.prevent="rightCardClick(game)" :cardInfo="createCardInfo(game)" :class="$style.gameCard" v-for="(game, i) in games" :key="i"/>
      </div>
    </q-expansion-item>
    <add-game-to-list-dialog
      :isOpen="isOpenAddGameDialog"
      @close="closeAddGameDialog"
      v-if="isOpenAddGameDialog"
      :listId="list.list.id"
    />
    <list-dialog
      :isOpen="isOpenEditListDialog"
      @close="closeEditListDialog"
      cardHeader="リストを編集"
      buttonLabel="確定"
      v-if="isOpenEditListDialog"
      @confirm="edit"
      :list="list.list"
    />
    <list-arrangement-dialog
      :isOpen="isOpenArrangementListDialog"
      @close="closeArrangementListDialog"
      v-if="isOpenArrangementListDialog"
    />
    <collection-relation-dialog
      :isOpen="isOpenCollectionRelationDialog"
      @close="closeCollectionRelationDialog"
      v-if="isOpenCollectionRelationDialog"
      :listId="list.list.id"
    />
    <remove-game-dialog
      v-if="isOpenRemoveGameDialog"
      :isOpen="isOpenRemoveGameDialog"
      @close="closeRemoveGameDialog"
      :listId="list.list.id"
      :games="games"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'
import { Game, PostListStruct, ListInServerWithGames } from 'src/types/root';
import AddGameToListDialog from './AddGameToListDialog.vue'
import ListArrangementDialog from './ListArrangementDialog.vue'
import CollectionRelationDialog from './CollectionRelationDialog.vue'
import RemoveGameDialog from './RemoveGameDialog.vue'
import ListDialog from './ListDialog.vue'
import useListRightClick from './use/useListRightClick'
import store from 'src/store'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const remote = require('electron').remote;
const MenuItem = remote.MenuItem;

export default defineComponent({
  name: 'ListContent',
  props: {
    list: {
      type: Object as PropType<ListInServerWithGames>, required: true
    },
  },
  components: { GameCard, AddGameToListDialog, ListDialog, ListArrangementDialog, CollectionRelationDialog, RemoveGameDialog },
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
    const games = computed(() => store.state.entities.listInServerGames[props.list.list.id] ?? [])

    const isOpenAddGameDialog = ref(false)
    const openAddGameDialog = () => {
      isOpenAddGameDialog.value = true
    }
    const closeAddGameDialog = () => {
      isOpenAddGameDialog.value = false
    }

    const isOpenCollectionRelationDialog = ref(false)
    const openCollectionRelationDialog = () => {
      isOpenCollectionRelationDialog.value = true
    }
    const closeCollectionRelationDialog = () => {
      isOpenCollectionRelationDialog.value = false
    }

    const isLoading = ref(false)
    const openToggle = async () => {
      isLoading.value = true
      if (props.list) {
        await store.dispatch.domain.setLatestList(props.list.list.id)
      }
      isLoading.value = false
    }

    const isOpenEditListDialog = ref(false)
    const openEditListDialog = () => {
      isOpenEditListDialog.value = true
    }
    const closeEditListDialog = () => {
      isOpenEditListDialog.value = false
    }
    const edit = async (payload: PostListStruct) => {
      if (props.list) {
        await store.dispatch.domain.putLists({ [props.list.list.id]: payload })
      }
    }

    const isOpenArrangementListDialog = ref(false)
    const openArrangementListDialog = () => {
      isOpenArrangementListDialog.value = true
    }
    const closeArrangementListDialog = () => {
      isOpenArrangementListDialog.value = false
    }

    const isOpenRemoveGameDialog = ref(false)
    const openRemoveGameDialog = async () => {
      if (props.list) {
        await store.dispatch.domain.setLatestList(props.list.list.id)
      }
      isOpenRemoveGameDialog.value = true
    }
    const closeRemoveGameDialog = () => {
      isOpenRemoveGameDialog.value = false
    }

    const deleteList = async () => {
      if (props.list) {
        const res = window.confirm(`リスト: 「${props.list.list.name}」を本当に削除しますか？`)
        if (res) {
          await store.dispatch.domain.deleteList(props.list.list.id)
        }
      }
    }
    const { setupMenuList, setupCardMenuList } = useListRightClick()
    const rightClick = () => {
      const menu = setupMenuList('リスト', openEditListDialog, openArrangementListDialog, async () => { await deleteList() })

      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(
        new MenuItem({
          label: 'ゲームを一括削除',
          click: openRemoveGameDialog
        })
      );

      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(
        new MenuItem({
          label: 'コレクションとの関連付け',
          click: openCollectionRelationDialog
        })
      );
      menu.popup()
    }

    const rightCardClick = (game: Game) => {
      const { setupMenuList } = useListRightClick()
      const menu = setupCardMenuList(game.gamename ?? '', async () => { await store.dispatch.domain.deleteGamesFromListInServer({ listId: props.list.list.id, gameIds: [game.id] }) })
      menu.popup()
    }
    return {
      games,
      createCardInfo,
      isOpenAddGameDialog,
      openAddGameDialog,
      closeAddGameDialog,
      isLoading,
      openToggle,
      rightClick,
      isOpenEditListDialog,
      closeEditListDialog,
      isOpenArrangementListDialog,
      closeArrangementListDialog,
      edit,
      isOpenCollectionRelationDialog,
      closeCollectionRelationDialog,
      isOpenRemoveGameDialog,
      closeRemoveGameDialog,
      rightCardClick,
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
