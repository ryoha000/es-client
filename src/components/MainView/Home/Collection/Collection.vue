<template>
  <div>
    <q-expansion-item
      expand-separator
      :class="$style.container"
      label="コレクション"
      header-style="font-size: 20px;"
    >
      <div :class="$style.wrapper">
        <q-btn
          label="新しいコレクションを作成"
          icon="add"
          rounded
          @click="openCreateCollectionDialog"
          :class="$style.addBtn"
        />
        <collection-content v-for="(list, i) in lists" :key="i" :list="list" />
      </div>
    </q-expansion-item>
    <create-list-dialog
      :isOpen="isOpenCreateCollectionDialog"
      @close="closeCreateCollectionDialog"
      @confirm="create"
      :iGames="[]"
      v-if="isOpenCreateCollectionDialog"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api';
import store from 'src/store';
import CollectionContent from './CollectionContent.vue'
import CreateListDialog from 'src/components/CreateListDialog.vue'
import { ListGame } from '../../../../types/root';
import useJson from 'src/components/use/useJson'

export default defineComponent({
  name: 'Collection',
  props: {
  },
  components: { CollectionContent, CreateListDialog },
  setup() {
    const lists = computed(() => store.state.app.lists)

    const isOpenCreateCollectionDialog = ref(false)
    const openCreateCollectionDialog = () => {
      isOpenCreateCollectionDialog.value = true
    }
    const closeCreateCollectionDialog = () => {
      isOpenCreateCollectionDialog.value = false
    }
    const create = async (payload: { title: string, games: ListGame[] }) => {
      const { createNewList } = useJson()
      await createNewList(payload.title, payload.games);
    }
    return {
      lists,
      isOpenCreateCollectionDialog,
      openCreateCollectionDialog,
      closeCreateCollectionDialog,
      create
    }
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
