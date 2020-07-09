<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">新しいコレクションの作成</div>
      </q-card-section>
      <q-item dense>
        <q-item-section>
          <q-input v-model="title" label="List Name" />
        </q-item-section>
      </q-item>
      <q-item dense>
        <q-item-section>
          <q-input v-model="searchString" square :class="$style.input">
            <template v-slot:prepend>
              <q-icon name="search" :class="$style.icon" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-item :class="$style.gameList">
        <q-item-section>
          <q-scroll-area :class="$style.gameList">
            <q-list separator dense>
              <q-item
                v-for="(path, i) in games"
                :key="i"
                clickable
                v-ripple
                :class="$style.game"
                :style="
                  initialGames.includes(path) ? 'background: skyblue;' : ''
                "
                @click="onClick(path)"
              >
                <q-item-section style="padding-right: 0;min-width: 0;" avatar>
                  <q-avatar square>
                    <img :src="'data:image/png;base64,' + path.icon" />
                  </q-avatar>
                </q-item-section>
                <q-item-section :class="$style.titleWrapper"
                  ><div :class="$style.title">
                    {{ gameName(path.id) }}
                  </div></q-item-section
                >
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-item-section>
      </q-item>
      <q-item dense>
        <q-item-section>
          <q-btn
            :class="$style.btn"
            color="primary"
            label="Create"
            @click="create"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import useJson from './use/useJson';
import { ListGame } from '../types/root';
import store from 'src/store';

export default defineComponent({
  name: 'CreateListDialog',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  setup(props, context) {
    const { createNewList } = useJson();
    const title = ref('');
    const searchString = ref('');
    const close = () => {
      title.value = '';
      searchString.value = '';
      context.emit('close');
    };
    const initialGames = ref<ListGame[]>([]);
    const onClick = (game: ListGame) => {
      initialGames.value.push(game);
    };
    const allGames = computed(() => store.state.entities.minimalGames);
    const gameName = (id: number) => {
      return allGames.value[id]?.gamename ?? '';
    };
    const create = async () => {
      await createNewList(title.value, initialGames.value);
      close();
    };
    const games = computed(() => {
      const haveGames = store.getters.app.getListById(0)?.games ?? [];
      return haveGames.filter(v => {
        if (searchString.value === '') {
          return true;
        }
        return (
          allGames.value[v.id]?.gamename
            .toLowerCase()
            .includes(searchString.value) ?? false
        );
      });
    });
    return {
      title,
      close,
      create,
      onClick,
      initialGames,
      gameName,
      searchString,
      games
    };
  }
});
</script>

<style lang="scss" module>
.gameList {
  height: 320px;
}

.titleWrapper {
  overflow: hidden;
  width: 328x;
  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    width: 328px;
    margin-left: 8px;
    font-size: 16px;
  }
}

.btn {
  margin: 8px 0;
}

.game {
  padding: 0;
  width: 368px;
}
</style>
