<template>
  <div>
    <div :class="$style.title">
      発売予定
    </div>
    <div :class="$style.wrapper" v-for="(schedule, i) in sellSchedules" :key="i">
      <schedule-day :schedule="schedule" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import ScheduleDay from './ScheduleDay.vue'
import { SellSchedule } from '../../../../types/root';

export default defineComponent({
  name: 'Schedule',
  props: {
    sellSchedules: {
      type: Array as PropType<SellSchedule[]>,
      default: []
    }
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
.wrapper {
  margin-top: 8px;
}
</style>