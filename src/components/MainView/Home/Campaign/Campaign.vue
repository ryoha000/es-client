<template>
  <div>
    <div :class="$style.title">キャンペーン情報</div>
    <campaign-content v-for="(campaign, i) in campaigns" :key="i" :campaign="campaign" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import CampaignContent from './CampaignContent.vue'
import { Campaign } from 'src/types/root';
import { getCampaigns } from 'src/lib/api';

export default defineComponent({
  name: 'Campaign',
  props: {
  },
  components: {
    CampaignContent
  },
  setup() {
    const campaigns = ref<Campaign[]>([])
    onMounted(async () => {
      campaigns.value = await getCampaigns()
    })
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