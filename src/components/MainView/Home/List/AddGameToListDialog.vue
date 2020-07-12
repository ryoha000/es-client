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
import { defineComponent, ref } from '@vue/composition-api';
import AddInputRow from 'src/components/AddInputRow.vue'
import store from 'src/store';
import { remote } from 'electron'
import useGameIds from './use/useGameIds'

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
      const { toNumArrFromNumStr, toIdArrFromTitle, toIdArrFromCSV } = useGameIds(store.state.entities.minimalGames)
      let ids: number[] = []
      let failedTitles: string[] = []
      switch (tabs.value) {
        case 'name':
          const res = toIdArrFromTitle(strs)
          ids = res.ids
          failedTitles = res.unknownTitles
          break
        case 'id':
          try {
            ids = toNumArrFromNumStr(strs)
          } catch (e) {
            remote.dialog.showErrorBox('エラー', e)
            return
          }
          break
        case 'csv':
          break
      }
      await store.dispatch.domain.addGames({ list_id: props.listId, game_ids: ids })
      if (failedTitles.length !== 0) {
        remote.dialog.showErrorBox('判断できないタイトルがありました', failedTitles.join('\n'))
      }
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
