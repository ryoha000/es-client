<template>
  <q-dialog v-model="isOpen" @before-hide="close" :persistent="loading">
    <q-card style="width: 400px" :class="$style.cardWrapper">
      <q-card-section>
        <div class="text-h6">ゲームを追加</div>
      </q-card-section>
      <q-item dense>
        <q-item-section>
          <q-btn flat style="color: black" label="新しく追加されたものを探す(推奨)" @click="diff" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-btn flat style="color: black" label="フォルダを探索しなおす(非常に重いです)" @click="all" />
          </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-btn flat style="color: black" label="自分で実行ファイルとゲームを指定して追加する" />
          </q-item-section>
      </q-item>
      <q-item :class="$style.loading" :style="loading ? 'z-index: 3' : 'z-index: -1'" >
        <q-item-section>
          <q-spinner
            color="primary"
            size="3em"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import useJudgeGame from '../use/useJudgeGame'
import { DMM } from '../../types/root';

export default defineComponent({
  name: 'AddGameDialog',
  props: {
    isOpen: {
      type: Boolean, required: true
    },
    allDMM: {
      type: Object as PropType<Record<number, DMM>>,
      required: true
    }
  },
  setup(props, context) {
    const loading = ref(false)
    const close = () => {
      context.emit('close')
    }
    const { searchAll, searchDifference } = useJudgeGame(props.allDMM)
    const diff = async () => {
      loading.value = true
      const newGames = await searchDifference()
      console.log(newGames)
      context.emit('addGame')
      loading.value = false
      let message = ''
      for (const g of newGames) {
        message += `${props.allDMM[g.id].name}, `
      }
      message += 'が追加されました'
      if (newGames.length === 0) {
        message = '追加されたゲームはありません'
      }
      alert(message)
      context.emit('close')
    }
    const all = async () => {
      loading.value = true
      const games = await searchAll()
      console.log(games)
      context.emit('addGame')
      loading.value = false
      context.emit('close')
    }
    return { close, loading, diff, all }
  }
});
</script>

<style lang="scss" module>
.cardWrapper {
  position: relative;
}
.loading {
  position: absolute;
  top: 40%;
  right: 170px;
}
</style>
