<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">{{ cardHeader }}</div>
      </q-card-section>
      <q-item dense v-if="isName">
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
                  initialGames.find(v => v.id === path.id) ? 'background: skyblue;' : ''
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
            :label="label"
            @click="create"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, onMounted } from '@vue/composition-api';
import { ListGame } from '../types/root';
import store from 'src/store';

export default defineComponent({
  name: 'CreateListDialog',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    cardHeader: {
      type: String, default: '新しいコレクションの作成',
    },
    label: {
      type: String, default: '作成'
    },
    iGames: {
      type: Array as PropType<ListGame[]>,
      default: [],
    },
    isName: {
      type: Boolean, default: true,
    },
    iName: {
      type: String, default: '',
    },
  },
  setup(props, context) {
    const title = ref('');
    const searchString = ref('');
    const close = () => {
      title.value = '';
      searchString.value = '';
      context.emit('close');
    };
    const initialGames = ref<ListGame[]>([]);
    const onClick = (game: ListGame) => {
      const i = initialGames.value.findIndex(v => v.id === game.id)
      if (i < 0) {
        initialGames.value.push(game);
      } else {
        initialGames.value.splice(i, 1)
      }
    };
    const allGames = computed(() => store.state.entities.minimalGames);
    const gameName = (id: number) => {
      return allGames.value[id]?.gamename ?? '';
    };
    const create = () => {
      context.emit('confirm', { title: title.value, games: initialGames.value })
      close();
    };
    const games = computed(() => {
      const haveGames = store.getters.app.getListById(0)?.games ?? [];
      return haveGames.filter(v => {
        if (searchString.value === '') {
          return true;
        }
        return (
          gameName(v.id)
            .toLowerCase()
            .includes(searchString.value)
        );
      });
    });
    onMounted(() => {
      initialGames.value = [...props.iGames]
      title.value = props.iName
    })
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
