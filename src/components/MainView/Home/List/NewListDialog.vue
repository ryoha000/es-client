<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">新しいリストの作成</div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <q-input :class="$style.input" v-model="name" label="リスト名" />
          <q-input :class="$style.input" v-model="comment" label="コメント" />
          <q-input :class="$style.input" v-model="url" label="関連URL" />
          <q-checkbox :class="$style.input" v-model="isPublic" label="公開する" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-btn label="作成" @click="click" color="primary" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import store from 'src/store';

export default defineComponent({
  name: 'NewListDialog',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  setup(props, context) {
    const close = () => {
      context.emit('close');
    };
    
    const name = ref('')
    const comment = ref('')
    const url = ref('')
    const isPublic = ref(true)

    const click = async () => {
      let mostLowPriority = 0
      for (const l of store.state.domain.listInServers) {
        const p = l.list.priority
        if (p < mostLowPriority) {
          mostLowPriority = p
        }
      }
      await store.dispatch.domain.addListInServer({
        name: name.value,
        comment: comment.value,
        priority: mostLowPriority,
        url: url.value ?? null,
        isPublic: isPublic.value
      })
    }
    return { close, name, comment, url, isPublic, click };
  }
});
</script>

<style lang="scss" module>
.input {
  margin-bottom: 8px;
}
</style>
