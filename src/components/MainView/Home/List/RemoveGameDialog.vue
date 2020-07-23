<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">リストからゲームを削除</div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <div>取り除くゲームにチェックを入れてください</div>
        </q-item-section>
      </q-item>
      <q-scroll-area :class="$style.scrollArea" >
        <q-list separator>
          <q-item
            dense
            v-for="(game, i) in games"
            :key="i"
            :class="$style.container"
          >
            <q-item-section side top>
              <q-checkbox v-model="checkboxArr[i]" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ game.gamename }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-item>
        <q-item-section>
          <q-btn label="確定" @click="confirm" color="primary" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from '@vue/composition-api';
import store from 'src/store'
import { Game } from '../../../../types/root';

export default defineComponent({
  name: 'RemoveGameDialog',
  props: {
    isOpen: {
      type: Boolean, required: true,
    },
    listId: {
      type: String, required: true,
    },
    games: {
      type: Array as PropType<Game[]>,
      default: [],
    }
  },
  setup(props, context) {
    const close = () => {
      context.emit('close');
    };

    const checkboxArr = ref<boolean[]>([])
    onMounted(() => {
      checkboxArr.value = props.games.map(() => false)
    })

    const confirm = async () => {
      const deleteGameIds: number[] = []
      const gameLen = props.games.length
      checkboxArr.value.forEach((v, i) => {
        if (v && i < gameLen) {
          deleteGameIds.push(props.games[i].id)
        }
      })
      await store.dispatch.domain.deleteGamesFromListInServer({ listId: props.listId, gameIds: deleteGameIds })
      close()
    }
    return { close, confirm, checkboxArr };
  }
});
</script>

<style lang="scss" module>
.container {
  overflow-x: hidden;
}
.item {
  height: 1.25rem;
  width: 80%;
  cursor: grab;
  transition: 0.5s;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.scrollArea {
  width: 100%;
  height: calc( 80vh - 164px );
}
</style>
