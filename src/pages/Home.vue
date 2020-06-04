<template>
  <div>
    <campaign-c :class="$style.item" :campaigns="campaigns" />
    <schedule :class="$style.item" :sellSchedules="sellSchedules" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import CampaignC from '../components/MainView/Home/Campaign/Campaign.vue'
import Schedule from '../components/MainView/Home/Schedule/Schedule.vue'
import useScraping from '../components/use/useScraping'
import { Campaign, SellSchedule } from '../types/root';

export default defineComponent({
  name: 'Home',
  props: {
    campaigns: {
      type: Array as PropType<Campaign[]>,
      default: []
    },
    sellSchedules: {
      type: Array as PropType<SellSchedule[]>,
      default: []
    }
  },
  components: { CampaignC, Schedule },
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