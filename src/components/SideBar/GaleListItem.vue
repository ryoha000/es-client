<template>
  <div :class="$style.container">
    <q-list dark  separator dense>
      <q-item
        v-for="(path, i) in listGames" :key="i"
        clickable
        v-ripple
        style="padding: 0;width: 231px;"
        @click="onClick(path)"
        @click.right.prevent="rightClick(path)"
      >
        <q-item-section style="padding-right: 0;min-width: 0;" avatar>
          <q-avatar square>
            <img :src="'data:image/png;base64,' + path.icon">
          </q-avatar>
        </q-item-section>
        <q-item-section :class="$style.titleWrapper"><div :class="$style.title">{{ gameName(path.id) }}</div></q-item-section>
      </q-item>
    </q-list>
    <create-list-dialog :isOpen="isOpenCreateListDialog" @close="closeCreateListDialog" :haveGames="games" @createList="createList" :allGames="allDmmGames" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from '@vue/composition-api';
import { ListGame, DMM, List } from '../../types/root';
import useElectron from '../use/useElectron'
import createListDialog from '../CreateListDialog.vue'
import useJson from '../use/useJson';

const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export default defineComponent({
  name: 'GameListItem',
  props: {
    games: { type: Array as PropType<ListGame[]>, required: true },
    allGames: { type: Object as PropType<Record<number, DMM>>, required: true },
    lists: {
      type: Array as PropType<List[]>,
      default: []
    }
  },
  components: {
    createListDialog
  },
  setup(props, context) {
    const onClick = (id: number) => {
      context.emit('game', id)
    }
    const allDmmGames = computed(() => props.allGames)
    const gameName = (id: number) => {
      if (allDmmGames.value[id]) {
        return allDmmGames.value[id].name
      }
      return ''
    }
    const isOpenCreateListDialog = ref(false)
    const rightClick = (game: ListGame) => {
      const { addGameToList } = useJson()
      const menu = new Menu()
      menu.append(new MenuItem({ label: '一覧から削除', click: function() { console.log('TODO: delete') } }));
      menu.append(new MenuItem({ type: 'separator' }));
      for (const list of props.lists) {
        if (list.id === 0) continue
        menu.append(new MenuItem({ label: `${list.name}に追加`, click: async() => {
          await addGameToList(list.id, game);
          context.emit('createList');
        }}))
        menu.append(new MenuItem({ type: 'separator' }));
      }
      menu.append(new MenuItem({ label: '新しいリストを作成', click: () => { isOpenCreateListDialog.value = true} }));
      menu.popup()
    }
    const closeCreateListDialog = () => {
      isOpenCreateListDialog.value = false
    }
    const createList = () => {
      context.emit('createList')
    }
    const listGames = computed(() => props.games)
    return { onClick, listGames, gameName, allDmmGames, rightClick, isOpenCreateListDialog, closeCreateListDialog, createList }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titleWrapper {
  overflow: hidden;
  width: 183px;
  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    width: 183px;
    margin-left: 8px;
    font-size: 16px;
  }
}

</style>