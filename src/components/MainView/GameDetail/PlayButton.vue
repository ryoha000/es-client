<template>
  <div :class="$style.container">
    <q-btn-dropdown
      split
      color="indigo-9"
      push
      no-caps
      @click="startProcess(undefined)"
    >
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left name="play_arrow" />
          <div class="text-center">
            Play
          </div>
        </div>
      </template>

      <q-list>
        <q-item clickable v-close-popup @click="openRelationDialog">
          <q-item-section>
            <q-item-label>関連付けの変更</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="startProcess(true)">
          <q-item-section>
            <q-item-label>管理者権限ありで実行</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="startProcess(false)">
          <q-item-section>
            <q-item-label>管理者権限無しで実行</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <change-relation @close="closeRelationDialog" :isOpen="isOpenRelationDialog" :listGame="nowListGame" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from '@vue/composition-api';
import { Game } from '../../../types/root';
import ChangeRelation from './ChangeRelation.vue'
import useStartProcess from '../../use/useStartProcess'
import store from 'src/store'

export default defineComponent({
  name: 'PlayButton',
  props: {
    game: {
      type: Object as PropType<Game>,
      required: true
    },
  },
  components: { ChangeRelation },
  setup(props) {
    const nowListGame = computed(() =>  store.getters.app.getListGameByGameId(props.game.id))
    const startProcess = async (isAdmin: boolean | undefined) => {
      if (!nowListGame.value) return
      const { startProcess } = useStartProcess(nowListGame.value)
      await startProcess(isAdmin)
    }
    const isOpenRelationDialog = ref(false)
    const closeRelationDialog = () => {
      isOpenRelationDialog.value = false
    }
    const openRelationDialog = () => {
      isOpenRelationDialog.value = true
    }
    return { startProcess, isOpenRelationDialog, openRelationDialog, closeRelationDialog, nowListGame }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
}
</style>