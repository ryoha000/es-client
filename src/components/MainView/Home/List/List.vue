<template>
  <div>
    <q-expansion-item
      expand-separator
      :class="$style.container"
      label="リスト"
      default-opened
      header-style="font-size: 20px;"
    >
      <div :class="$style.wrapper">
        <q-btn label="新しいリストを作成" icon="add" rounded @click="openCreateListDialog" :class="$style.addBtn" />
        <list-content v-for="(list, i) in lists" :key="i" :list="list" />
      </div>
    </q-expansion-item>
    <new-list-dialog v-if="isOpenCreateListDialog" :isOpen="isOpenCreateListDialog" @close="closeCreateListDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api';
import store from 'src/store';
import ListContent from './ListContent.vue'
import NewListDialog from './NewListDialog.vue'

export default defineComponent({
  name: 'List',
  props: {
  },
  components: { ListContent, NewListDialog },
  setup() {
    const lists = computed(() => store.state.domain.listInServers)

    const isOpenCreateListDialog = ref(false)
    const openCreateListDialog = () => {
      isOpenCreateListDialog.value = true
    }
    const closeCreateListDialog = () => {
      isOpenCreateListDialog.value = false
    }
    return { lists, isOpenCreateListDialog, openCreateListDialog, closeCreateListDialog }
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