<template>
  <div>
    <q-expansion-item
      expand-separator
      :class="$style.container"
      label="キャンペーン情報"
      default-opened
    >
      <div :class="$style.wrapper">
        <campaign-content v-for="(campaign, i) in campaigns" :key="i" :campaign="campaign" />
      </div>
    </q-expansion-item>
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

.wrapper {
  padding: 16px;
}

.container {
  width: 100%;
  font-size: 20px;
}
</style>