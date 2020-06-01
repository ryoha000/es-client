<template>
  <div>
    <div :class="$style.title">キャンペーン名</div>
    <horizontal-scroll />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'
import HorizontalScroll from '../../HorizontalScroll.vue'

export default defineComponent({
  name: 'CampaignContent',
  props: {
  },
  components: { GameCard, HorizontalScroll },
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.title {
  font-size: 20px;
  margin-bottom: 4px;
}
</style>