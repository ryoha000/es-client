<template>
  <div>
    <q-btn icon="add_box" class="full-width" @click="onClick">
      <div style="margin-left: 8px;" />
      ゲームを追加
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import useScraping from '../use/useScraping'

export default defineComponent({
  name: 'AddGame',
  setup() {
    const { getTitle } = useScraping()
    const onClick = async () => {
      console.log(await getTitle())
    }
    return { onClick }
  }
});
</script>

<style lang="scss" module>

</style>