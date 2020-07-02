<template>
  <div>
    <div :class="$style.title">キャンペーン情報</div>
    <campaign-content v-for="(campaign, i) in campaigns" :key="i" :campaign="campaign" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import CampaignContent from './CampaignContent.vue'
import store from 'src/store';

export default defineComponent({
  name: 'Campaign',
  props: {
  },
  components: {
    CampaignContent
  },
  setup() {
    const campaigns = computed(() => store.state.domain.campaigns)
    return { campaigns }
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