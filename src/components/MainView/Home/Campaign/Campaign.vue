<template>
  <div>
    <div :class="$style.title">キャンペーン情報</div>
    <campaign-content v-for="(campaign, i) in campaigns" :key="i" :campaign="campaign" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import CampaignContent from './CampaignContent.vue'
import { Campaign } from '../../../../types/root';

export default defineComponent({
  name: 'Campaign',
  props: {
    campaigns: {
      type: Array as PropType<Campaign[]>,
      default: []
    }
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
.title {
  font-size: 22px;
  margin-left: 8px;
  margin-bottom: 8px;
}
</style>