<template>
  <div :class="$style.container">
    <div :class="$style.title">キャンペーン情報</div>
    <campaign-content />
    <campaign-content />
    <campaign-content />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import CampaignContent from './CampaignContent.vue'

export default defineComponent({
  name: 'Campaign',
  props: {
  },
  components: {
    CampaignContent
  },
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.container {
}
.title {
  font-size: 22px;
  margin-left: 8px;
  margin-bottom: 8px;
}
</style>