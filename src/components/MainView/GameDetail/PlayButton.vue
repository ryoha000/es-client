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
        <q-item clickable v-close-popup @click="openPostReviewDialog">
          <q-item-section>
            <q-item-label>レビューを投稿</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <change-relation @close="closeRelationDialog" :isOpen="isOpenRelationDialog" :listGame="nowListGame" />
    <post-review-dialog
      @close="closePostReviewDialog"
      :isOpen="isOpenPostReviewDialog"
      :id="id"
      v-if="isOpenPostReviewDialog"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import ChangeRelation from './ChangeRelation.vue'
import useStartProcess from '../../use/useStartProcess'
import store from 'src/store'
import PostReviewDialog from './PostReviewDialog.vue'

export default defineComponent({
  name: 'PlayButton',
  props: {
  },
  components: { ChangeRelation, PostReviewDialog },
  setup() {
    const id = computed(() => store.state.domain.gameDetail?.id ?? 0)
    const nowListGame = computed(() => store.getters.app.getListGameByGameId(store.state.domain.gameDetail?.id ?? 0))
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

    const isOpenPostReviewDialog = ref(false)
    const closePostReviewDialog = () => {
      isOpenPostReviewDialog.value = false
    }
    const openPostReviewDialog = () => {
      isOpenPostReviewDialog.value = true
    }
    return { startProcess, isOpenRelationDialog, openRelationDialog, closeRelationDialog, nowListGame, isOpenPostReviewDialog, openPostReviewDialog, closePostReviewDialog, id }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
}
</style>