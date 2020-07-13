<template>
  <div>
    <q-expansion-item
      expand-separator
      :class="$style.container"
      label="リスト"
      header-style="font-size: 20px;"
    >
      <div :class="$style.wrapper">
        <q-btn
          label="新しいリストを作成"
          icon="add"
          rounded
          @click="openCreateListDialog"
          :class="$style.addBtn"
        />
        <list-content v-for="(list, i) in lists" :key="i" :listId="list.list.id" :games="getGames(list.list.id)" :list="list" />
      </div>
    </q-expansion-item>
    <list-dialog
      v-if="isOpenCreateListDialog"
      :isOpen="isOpenCreateListDialog"
      @close="closeCreateListDialog"
      buttonLabel="作成"
      cardHeader="新しいリストを作成"
      @confirm="createNewList"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api';
import store from 'src/store';
import ListContent from './ListContent.vue'
import ListDialog from './ListDialog.vue'
import usePriority from './use/usePriority'
import { PostListStruct } from '../../../../types/root';

export default defineComponent({
  name: 'List',
  props: {
  },
  components: { ListContent, ListDialog },
  setup() {
    const lists = computed(() => store.getters.domain.getLists())
    const getGames = (id: string) => {
      return store.getters.domain.getListGamesById(id) ?? []
    }

    const isOpenCreateListDialog = ref(false)
    const openCreateListDialog = () => {
      isOpenCreateListDialog.value = true
    }
    const closeCreateListDialog = () => {
      isOpenCreateListDialog.value = false
    }

    const createNewList = async (payload: PostListStruct) => {
      const { getMostLowPriority } = usePriority(store.getters.domain.getSimpleLists())
      await store.dispatch.domain.addListInServer({
        name: payload.name,
        comment: payload.comment,
        priority: getMostLowPriority() - 100,
        url: payload.url ?? null,
        isPublic: payload.isPublic
      })
      isOpenCreateListDialog.value = false
    }
    return { lists, isOpenCreateListDialog, openCreateListDialog, closeCreateListDialog, createNewList, getGames }
  }
});
</script>

<style lang="scss" module>
.wrapper {
  padding: 16px;
}

.container {
  width: 100%;
}

.addBtn {
  margin-bottom: 8px;
}
</style>