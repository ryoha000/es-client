<template>
  <div :class="$style.container">
    <div :class="$style.title">キャンペーン情報</div>
    <div :class="$style.gamecards">
      <game-card />
      <game-card />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'

export default defineComponent({
  name: 'Campaign',
  props: {
  },
  components: {
    GameCard
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
.gamecards {
  display: flex;
  flex-wrap: wrap;
  :nth-child(n) {
    margin-right: 8px;
  }
}
</style>