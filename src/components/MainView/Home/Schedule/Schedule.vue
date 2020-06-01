<template>
  <div>
    <div :class="$style.title">
      発売予定
    </div>
    <schedule-day />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import ScheduleDay from './ScheduleDay.vue'

export default defineComponent({
  name: 'Schedule',
  props: {
  },
  components: { ScheduleDay },
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.title {
  font-size: 22px;
  margin-left: 8px;
}
</style>