<template>
  <div>
    <q-expansion-item
      expand-separator
      :class="$style.container"
      label="発売予定"
      header-style="font-size: 20px;"
    >
      <div :class="$style.wrapper" v-for="(schedule, i) in sellSchedules" :key="i">
        <schedule-day :schedule="schedule" />
      </div>
    </q-expansion-item>
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
  padding-left: 16px;
}
.container {
  width: 100%;
}
</style>