<template>
  <div :class="$style.container">
    <q-btn-dropdown
      split
      color="indigo-9"
      push
      no-caps
      @click="startProcess"
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
      </q-list>
    </q-btn-dropdown>
    <change-relation @close="closeRelationDialog" :isOpen="isOpenRelationDialog" :listGame="gameInList[game.id]" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api';
import { ListGame, Game } from '../../../types/root';
import ChangeRelation from './ChangeRelation.vue'
import * as ChileProcess from 'child_process'
import * as iconv from 'iconv-lite'
import * as path from 'path'

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
  setup(props) {
    const startProcess = () => {
      const listGame = props.gameInList[props.game.id]
      if (listGame) {
        const splitPath = listGame.path.split('\\')
        const exe = splitPath.pop()
        const fp = splitPath.join('\\')
        const normalizedFile = path.normalize(path.resolve(fp)).replace(/\'/g,'\'\'')
        const command = `cd \'${normalizedFile}\' ; powershell Start-Process ${exe} -verb runas`
        // 何故か if(Buffer.isBuffer(stderr)) で判定してもダメだからanyに
        ChileProcess.exec(`powershell.exe -command "${command}"`, {encoding: 'binary', maxBuffer: 64*1024*1024}, (err, stdout, stderr: any) => {
        if (err) {
          const str = iconv.decode(stderr, 'shiftjis')
          alert(str)
        }
        return
      })
      }
    }
    const isOpenRelationDialog = ref(false)
    const closeRelationDialog = () => {
      isOpenRelationDialog.value = false
    }
    const openRelationDialog = () => {
      isOpenRelationDialog.value = true
    }
    return { startProcess, isOpenRelationDialog, openRelationDialog, closeRelationDialog }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
}
</style>