<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">コレクションをリストに関連付ける</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h8">コレクションと関連付けることでコレクションにゲームが追加されたときこのリストにも追加します</div>
        <div class="text-h8">リストに追加されてもコレクションには追加されません</div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <q-scroll-area :class="$style.gameList">
            <q-list separator dense>
              <q-item
                v-for="(collection, i) in collections"
                :key="i"
                clickable
                v-ripple
                :class="$style.game"
                :style="
                  checkSelected(collection) ? 'background: skyblue;' : ''
                "
                @click="click(collection)"
              >
                <q-item-section :class="$style.titleWrapper"
                  ><div :class="$style.title">
                    {{ collection.name }}
                  </div></q-item-section
                >
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-btn label="確定" @click="confirm" color="primary" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import store from 'src/store'
import useJson from 'src/components/use/useJson'
import { List } from '../../../../types/root';

export default defineComponent({
  name: 'CollectionRelationDialog',
  props: {
    isOpen: {
      type: Boolean, required: true,
    },
    listId: {
      type: String, required: true,
    }
  },
  setup(props, context) {
    const close = () => {
      context.emit('close');
    };
    
    const collections = computed(() => store.state.app.lists)
    const selected = ref<List | null>(null)
    const click = (collection: List) => {
      if (checkSelected(collection)) {
        selected.value = null
      } else {
        selected.value = collection
      }
    }
    const checkSelected = (collection: List) => {
      return collection.id === selected.value?.id
    }
    const confirm = async () => {
      const { updateOrInsertList } = useJson()
      if (selected.value) {
        await updateOrInsertList({ ...selected.value, relation: props.listId })
        await store.dispatch.domain.addGames({ list_id: props.listId, game_ids: selected.value.games.map(v => v.id) })
      }
      close()
    }
    return { close, collections, confirm, click, selected, checkSelected };
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