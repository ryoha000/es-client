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
    <change-relation @close="closeRelationDialog" :isOpen="isOpenRelationDialog" :listGame="gameInList[game.id]" @createList="createList" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from '@vue/composition-api';
import { ListGame, Game } from '../../../types/root';
import ChangeRelation from './ChangeRelation.vue'
import * as ChileProcess from 'child_process'
import * as iconv from 'iconv-lite'
import * as path from 'path'
import useJson from '../../use/useJson';
import useStartProcess from '../../use/useStartProcess'

export default defineComponent({
  name: 'PlayButton',
  props: {
    game: {
      type: Object as PropType<Game>,
      required: true
    },
    gameInList :{
      type: Object as PropType<Record<number, ListGame>>,
      required: true
    }
  },
  components: { ChangeRelation },
  setup(props, context) {
    const { readFileConsoleErr, override, getHistory } = useJson()
    const startProcess = async (isAdmin: boolean | undefined) => {
      const { startProcess } = useStartProcess(props.gameInList[props.game.id])
      await startProcess(isAdmin)
    }
    const isOpenRelationDialog = ref(false)
    const closeRelationDialog = () => {
      isOpenRelationDialog.value = false
    }
    const openRelationDialog = () => {
      isOpenRelationDialog.value = true
    }
    const createList = () => {
      context.emit('createList')
    }
    return { startProcess, isOpenRelationDialog, openRelationDialog, closeRelationDialog, createList }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
}
</style>