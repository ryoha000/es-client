<template>
  <div :class="$style.container">
    <q-select
      :class="$style.select"
      dark
      v-model="model"
      :options="options"
      @input="input"
    />
    <q-icon
      :class="$style.icon"
      name="schedule"
      size="22px"
      :color="isSortByLastAccess ? 'blue' : 'snow'"
      @click="sortAccessTime"
    />
    <create-list-dialog @createList="createList" :isOpen="isOpenCreateListDialog" @close="closeCreateListDialog" :haveGames="haveGames" :allGames="allGames"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from '@vue/composition-api';
import { List, ListGame, DMM } from '../../types/root';
import CreateListDialog from '../CreateListDialog.vue'

export default defineComponent({
  name: 'FilterGame',
  props: {
    isSortByLastAccess: {
      type: Boolean, required: true
    },
    lists: {
      type: Array as PropType<List[]>,
      default: []
    },
    haveGames: {
      type: Array as PropType<ListGame[]>,
      required: true
    },
    allGames: { type: Object as PropType<Record<number, DMM>>, required: true },
  },
  components: {
    CreateListDialog
  },
  setup(props, context) {
    const model = ref('所持ゲーム')
    // const options = ref([
    //   '〇〇リスト', '〇〇リスト', '〇〇リスト', '〇〇リスト', '新しいリストを作成'
    // ])
    //const options = computed(() => [...props.lists.map(v => v.name), '新しいリストを作成'])
    const options = computed(() => [...props.lists.map(v => ({label: v.name, id: v.id})), '新しいリストを作成'])
    const sortAccessTime = () => {
      context.emit('sortByLastAccess')
    }
    const isOpenCreateListDialog = ref(false)
    const closeCreateListDialog = () => {
      isOpenCreateListDialog.value = false
    }
    const createList = () => {
      context.emit('createList')
    }
    const input = (v: string | {label: string, id: number}) => {
      if (typeof v === 'string') {
        if (v === '新しいリストを作成') {
          model.value = '所持ゲーム'
          isOpenCreateListDialog.value = true
        }
      }
      if (typeof v === 'object') {
        context.emit('filter', v)
      }
    }
    return { model, options, sortAccessTime, createList, isOpenCreateListDialog, closeCreateListDialog, input }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.select {
  width: calc( 100% - 28px );
  height: 32px;
  :nth-child(n) {
    height: 32px;
    padding: 0px;
    text-align: center;
    line-height: 32px;
    min-height: 32px !important;
  }
}

.icon {
  margin: 8px;
  margin-left: 4px;
  margin-top: 12px;
  cursor: pointer;
}
</style>
