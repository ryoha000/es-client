<template>
  <div>
    <campaign-c :class="$style.item" :campaigns="campaigns" />
    <schedule :class="$style.item" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import CampaignC from '../components/MainView/Home/Campaign/Campaign.vue'
import Schedule from '../components/MainView/Home/Schedule/Schedule.vue'
import { Promised } from 'vue-promised';
import useScraping from '../components/use/useScraping'
import { Campaign } from '../types/root';

export default defineComponent({
  name: 'Home',
  props: {
    campaigns: {
      types: Array as PropType<Campaign[]>,
      default: []
    }
  },
  components: { CampaignC, Schedule, Promised },
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.item {
  margin-top: 8px;
}
</style>