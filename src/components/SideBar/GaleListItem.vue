<template>
  <div :class="$style.container">
    <q-list dark separator dense>
      <q-item
        v-for="(path, i) in games"
        :key="i"
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
        <q-item-section :class="$style.titleWrapper"
          ><div :class="$style.title">
            {{ gameName(path.id) }}
          </div></q-item-section
        >
      </q-item>
    </q-list>
    <create-list-dialog
      v-if="isOpenCreateListDialog"
      :isOpen="isOpenCreateListDialog"
      @close="closeCreateListDialog"
      @confirm="create"
      :iGames="[]"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from '@vue/composition-api';
import { ListGame } from '../../types/root';
import createListDialog from '../CreateListDialog.vue';
import useJson from '../use/useJson';
import useStartProcess from '../use/useStartProcess';
import store from 'src/store';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export default defineComponent({
  name: 'GameListItem',
  props: {
    games: { type: Array as PropType<ListGame[]>, required: true },
    filterListId: { type: Number, default: 0 }
  },
  components: {
    createListDialog
  },
  setup(props, context) {
    const haveGameInfo = computed(() => store.state.entities.haveGames);
    const clicked = ref(false);
    const onClick = async (game: ListGame) => {
      if (clicked.value) {
        clicked.value = false;
        const { startProcess } = useStartProcess(game);
        await startProcess(undefined);
        return;
      }
      await store.dispatch.app.goDetail(game.id);

      clicked.value = true;

      setTimeout(function() {
        clicked.value = false;
      }, 300);
    };
    const gameName = (id: number) => {
      return haveGameInfo.value[id]?.gamename ?? '';
    };
    const isOpenCreateListDialog = ref(false);

    const lists = computed(() => store.state.app.lists);
    const rightClick = (game: ListGame) => {
      const { addGameToList, removeGameFromList, updateImage } = useJson();

      const menu = new Menu();
      menu.append(
        new MenuItem({
          label: '一覧から削除',
          click: async () => {
            await removeGameFromList(props.filterListId, game);
            context.emit('createList');
          }
        })
      );
      menu.append(new MenuItem({ type: 'separator' }));

      menu.append(
        new MenuItem({
          label: 'アイコンを変更',
          click: async () => {
            const result = await remote.dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
              title: 'フォルダ(複数選択)',
              defaultPath: '.'
            });
            if (result.filePaths.length > 0) {
              await updateImage(game.path, result.filePaths[0]);
            }
            context.emit('createList');
          }
        })
      );
      menu.append(new MenuItem({ type: 'separator' }));

      for (const list of lists.value) {
        if (list.id === 0) continue;
        menu.append(
          new MenuItem({
            label: `${list.name}に追加`,
            click: async () => {
              await addGameToList(list.id, game);
              context.emit('createList');
            }
          })
        );
        menu.append(new MenuItem({ type: 'separator' }));
      }

      menu.append(
        new MenuItem({
          label: '新しいコレクションを作成',
          click: () => {
            isOpenCreateListDialog.value = true;
          }
        })
      );
      menu.popup();
    };
    const closeCreateListDialog = () => {
      isOpenCreateListDialog.value = false;
    };
    const create = async (payload: { title: string, games: ListGame[] }) => {
      const { createNewList } = useJson()
      await createNewList(payload.title, payload.games);
    }
    return {
      onClick,
      gameName,
      rightClick,
      isOpenCreateListDialog,
      closeCreateListDialog,
      create
    };
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
