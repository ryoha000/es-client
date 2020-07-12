<template>
  <div>
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
        <game-card :cardInfo="createCardInfo(game)" :class="$style.gameCard" v-for="(game, i) in list.games" :key="i"/>
      </div>
    </q-expansion-item>
    <add-game-to-list-dialog :isOpen="isOpenAddGameDialog" @close="closeAddGameDialog" v-if="isOpenAddGameDialog" :listId="list.list.id" />
    <list-dialog :isOpen="isOpenEditListDialog" @close="closeEditListDialog" cardHeader="リストを編集" buttonLabel="確定" v-if="isOpenEditListDialog" @confirm="edit" :list="list.list" />
    <list-arrangement-dialog :isOpen="isOpenArrangementListDialog" @close="closeArrangementListDialog" v-if="isOpenArrangementListDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'
import { Game, ListInServerWithGames, PostListStruct } from 'src/types/root';
import AddGameToListDialog from './AddGameToListDialog.vue'
import ListArrangementDialog from './ListArrangementDialog.vue'
import ListDialog from './ListDialog.vue'
import useListRightClick from './use/useListRightClick'
import store from 'src/store'

export default defineComponent({
  name: 'ListContent',
  props: {
    list: {
      type: Object as PropType<ListInServerWithGames>,
      required: true
    }
  },
  components: { GameCard, AddGameToListDialog, ListDialog, ListArrangementDialog },
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

    const isOpenEditListDialog = ref(false)
    const openEditListDialog = () => {
      isOpenEditListDialog.value = true
    }
    const closeEditListDialog = () => {
      isOpenEditListDialog.value = false
    }
    const edit = async (payload: PostListStruct) => {
      await store.dispatch.domain.putLists({ [props.list.list.id]: payload })
    }

    const isOpenArrangementListDialog = ref(false)
    const openArrangementListDialog = () => {
      isOpenArrangementListDialog.value = true
    }
    const closeArrangementListDialog = () => {
      isOpenArrangementListDialog.value = false
    }
    const rightClick = () => {
      const { setupMenuList } = useListRightClick()
      const menu = setupMenuList('リスト', openEditListDialog, openArrangementListDialog, () => { console.log('delete') })
      menu.popup()
    }
    return {
      createCardInfo,
      addCardClick,
      onClickContent,
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
      edit
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
