<template>
  <portal to="tooltip" v-if="isHover">
    <div :class="[isLeaveAnime ? $style.leaveTooltip : $style.inTooltip, $style.tooltip]">
      <div :class="$style.tooltipContent">{{ tooltipContent }}</div>
    </div>
  </portal>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Timeline',
  props: {
    isHover: {
      type: Boolean, required: true,
    },
    isLeaveAnime: {
      type: Boolean, required: true,
    },
    tooltipContent: {
      type: String, required: true,
    }
  },
  setup() {
    return {  }
  }
});
</script>

<style lang="scss" module>
.tooltip {
  width: 160px;
  max-height: 12.5rem;
  overflow: hidden;

  border-radius: 8px;
  background: rgba(0, 0, 0, 0.7);
}

.inTooltip {
  animation: SlideIn 0.5s 1;
}

.leaveTooltip {
  animation: SlideOut 0.5s 1;
}

.tooltipContent {
  white-space: pre-wrap;
  padding: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 9;
  margin: 0;
}

/* CSSアニメーションの設定 */
@keyframes SlideIn {
  0% {
    opacity: 0;/*初期状態では透明に*/
    transform: translateX(16px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes SlideOut {
  0% {
    opacity: 1;/*初期状態では透明に*/
    transform: translateX(0px);
  }
  100% {
    opacity: 0;
    transform: translateX(-16px);
  }
}
</style>