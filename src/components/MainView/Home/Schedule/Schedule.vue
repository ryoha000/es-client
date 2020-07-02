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
import { defineComponent, computed } from '@vue/composition-api';
import ScheduleDay from './ScheduleDay.vue'
import store from 'src/store'

export default defineComponent({
  name: 'Schedule',
  props: {
  },
  components: { ScheduleDay },
  setup() {
    const sellSchedules = computed(() => store.state.domain.schedules)
    return { sellSchedules }
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