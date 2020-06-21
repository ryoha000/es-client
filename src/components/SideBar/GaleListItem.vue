<template>
  <div :class="$style.container">
    <q-list dark  separator dense>
      <q-item
        v-for="(path, i) in games" :key="i"
        clickable
        v-ripple
        style="padding: 0;width: 231px;"
        @click="onClick(path)"
        @click.right.prevent="rightClick(path)"
      >
        <q-item-section style="padding-right: 0;min-width: 0;" avatar>
          <q-avatar square>
            <q-img :ratio="1" :src="'data:image/png;base64,' + path.icon" />
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
import createListDialog from '../CreateListDialog.vue'
import useJson from '../use/useJson';
import useStartProcess from '../use/useStartProcess'

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
    },
    filterListId: { type: Number, default: 0 }
  },
  components: {
    createListDialog
  },
  setup(props, context) {
    const clicked = ref(false)
    const onClick = async (game: ListGame) => {
      if (clicked.value) {
        clicked.value = false;
        const { startProcess } = useStartProcess(game)
        await startProcess(undefined)
        return;
      }

      clicked.value = true;

      setTimeout(function () {
        if (clicked.value) {
          context.emit('game', game.id)
        }
        clicked.value = false;
      }, 300);
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
      const { addGameToList, removeGameFromList, updateImage } = useJson()

      const menu = new Menu()
      menu.append(new MenuItem({ label: '一覧から削除', click: async() => {
        await removeGameFromList(props.filterListId, game)
        context.emit('createList');
      }}));
      menu.append(new MenuItem({ type: 'separator' }));

      menu.append(new MenuItem({ label: 'アイコンを変更', click: async() => {
        const result = await remote.dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
          title: 'フォルダ(複数選択)',
          defaultPath: '.'
        })
        if (result.filePaths.length > 0) {
          await updateImage(game.path, result.filePaths[0])
        }
        context.emit('createList');
      }}));
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
    return { onClick, gameName, allDmmGames, rightClick, isOpenCreateListDialog, closeCreateListDialog, createList }
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
    user-select: none;
  }
}

</style>