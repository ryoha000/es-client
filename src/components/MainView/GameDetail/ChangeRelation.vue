<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">実行ファイルとゲームの関連付けの変更</div>
      </q-card-section>
      <q-item-label header>ErogameScapeのURLを入力してください</q-item-label>
      <q-item>
        <q-item-section>
          <q-input v-model="url" label="ErogameScape URL" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-btn @click="confirm" color="primary" label="Confirm" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from '@vue/composition-api';
import useJson from '../../use/useJson';
import { ListGame } from '../../../types/root';


export default defineComponent({
  name: 'ChangeRelation',
  props: {
    isOpen: { type: Boolean, required: true },
    listGame: {type: Object as PropType<ListGame>, required: true}
  },
  setup(props, context) {
    const { updateRelation } = useJson()
    const url = ref('')
    const close = () => {
      context.emit('close')
    }
    const confirm = async () => {
      if (!url.value.startsWith('https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=')) {
        alert('正しいURLを入力してください\n例) https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=26000')
        return
      }
      try {
        const id = +(url.value.replace('https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=', '')).replace('#ad', '')
        await updateRelation(props.listGame.path, id)
        context.emit('createList')
        context.emit('close')
      } catch (e) {
        console.error(e)
        alert('正しいURLを入力してください\n例) https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=26000')
      }
    }
    return { url, close, confirm }
  }
});
</script>

<style lang="scss" module>

</style>
