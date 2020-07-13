<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">リストを並べ替え</div>
      </q-card-section>
      <q-list separator>
        <draggable
          class="list-group"
          tag="div"
          v-model="lists"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
          @change="(e) => change(e)"
        >
          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <q-item
              dense
              v-for="element in lists"
              :key="element.id"
              :class="$style.container"
            >
              <q-item-section>
                <q-item-label
                  :class="$style.item"
                  v-if="element.id !== 0"
                >
                  {{ element.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </transition-group>
        </draggable>
      </q-list>
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
import draggable from 'vuedraggable';
import usePriority from './use/usePriority'
import useJson from 'src/components/use/useJson'

export default defineComponent({
  name: 'CollectionArrangementDialog',
  props: {
    isOpen: {
      type: Boolean, required: true,
    },
  },
  components: { draggable },
  setup(props, context) {
    const close = () => {
      context.emit('close');
    };
    
    const lists = ref(store.state.app.lists.map((v, i) => ({ ...v, priority: i * 100, fixed: true })).filter(v => v.id !== 0))

    const dragOptions = computed(() => ({
      animation: 200,
      group: 'description',
      disabled: false,
      ghostClass: 'ghost'
    }))
    const drag = ref(false)

    const change = (e: { moved: { newIndex: number, oldIndex: number }}) => {
      const newIndex = e.moved.newIndex
      const { getNewPriority } = usePriority(lists.value)
      const newPriority = getNewPriority(e.moved.newIndex)
      lists.value[newIndex].priority = newPriority
    }

    const confirm = async () => {
      const { setLists } = useJson()
      const have = store.getters.app.getListById(0)
      if (have) {
        await setLists([have, ...lists.value])
      }
      close()
    }
    return { close, lists, confirm, dragOptions, drag, change };
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

</style>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
  max-width: 100%;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: grabbing;
}
</style>
