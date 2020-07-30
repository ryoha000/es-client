<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">{{ cardHeader }}</div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <q-input :class="$style.input" v-model="name" label="リスト名" />
          <!-- <q-input :class="$style.input" v-model="comment" label="コメント" /> -->
          <q-input :class="$style.input" v-model="url" label="関連URL" />
          <q-checkbox :class="$style.input" v-model="isPublic" label="公開する" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-btn :label="buttonLabel" @click="click" color="primary" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from '@vue/composition-api';
import { ListInServer } from '../../../../types/root';

export default defineComponent({
  name: 'ListDialog',
  props: {
    isOpen: {
      type: Boolean, required: true,
    },
    cardHeader: {
      type: String, required: true,
    },
    buttonLabel: {
      type: String, required: true,
    },
    list: {
      type: Object as PropType<ListInServer | undefined>,
      default: undefined
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

    const click = () => {
      context.emit('confirm', {
        name: name.value,
        comment: comment.value,
        priority: props.list?.priority ?? 0,
        url: url.value ?? null,
        isPublic: isPublic.value
      })
      close()
    }

    onMounted(() => {
      if (props.list) {
        name.value = props.list.name
        comment.value = props.list.comment
        url.value = props.list.url ?? ''
        isPublic.value = props.list.is_public
      }
    })
    return { close, name, comment, url, isPublic, click };
  }
});
</script>

<style lang="scss" module>
.input {
  margin-bottom: 8px;
}
</style>
