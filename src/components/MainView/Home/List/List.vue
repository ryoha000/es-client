<template>
  <q-expansion-item
    expand-separator
    :class="$style.container"
    label="リスト"
    default-opened
    header-style="font-size: 20px;"
  >
    <div :class="$style.wrapper">
      <div>aaa</div>
      <q-btn label="新しいリストを作成" />
      <list-content v-for="(list, i) in lists" :key="i" :list="list" />
    </div>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import store from 'src/store';
import ListContent from './ListContent.vue'

export default defineComponent({
  name: 'List',
  props: {
  },
  components: {
    ListContent
  },
  setup() {
    const lists = computed(() => store.state.domain.listInServers)
    return { lists }
  }
});
</script>

<style lang="scss" module>
.wrapper {
  padding: 16px;
}

.container {
  width: 100%;
}
</style>