<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">リストにゲームを追加</div>
      </q-card-section>
      <q-tabs
        v-model="tabs"
        no-caps
        class="bg-orange text-white shadow-2"
      >
        <q-tab name="name" label="Name" />
        <q-tab name="id" label="ID" />
        <q-tab name="csv" label="CSV" />
      </q-tabs>
      <add-input-row label="追加" @confirm="click" v-if="tabs !== 'csv'" />
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import AddInputRow from 'src/components/AddInputRow.vue'
import store from 'src/store';
import { remote } from 'electron'

export default defineComponent({
  name: 'AddGameToListDialog',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    listId: {
      type: String, required: true
    }
  },
  components: { AddInputRow },
  setup(props, context) {
    const close = () => {
      context.emit('close');
    };
    const tabs = ref<'name' | 'id' | 'csv'>('name')
    const click = async (strs: string[]) => {
      switch (tabs.value) {
        case 'name':
          break
        case 'id':
          try {
            const ids = strs.map(v => {
              const num = Number(v)
              if (isNaN(num)) throw '入力されたIDが数字でありません'
              return num
            })
            await store.dispatch.domain.addGames({ list_id: props.listId, game_ids: ids})
          } catch (e) {
            remote.dialog.showErrorBox('エラー', e)
          }
          break
        case 'csv':
          break
      }
      console.log('追加')
    }

    return { close, click, tabs };
  }
});
</script>

<style lang="scss" module>
.input {
  display: flex;
  :first-child {
    width: 320px;
  }
  :nth-child(2) {
    width: 42px;
    height: 42px;
  }
}
.addBtn {
  margin: 0 auto;
  width: 42px;
}
</style>
