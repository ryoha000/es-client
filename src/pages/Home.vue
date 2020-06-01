<template>
  <div>
    <schedule :class="$style.item" />
    <campaign :class="$style.item" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import Campaign from '../components/MainView/Home/Campaign/Campaign.vue'
import Schedule from '../components/MainView/Home/Schedule/Schedule.vue'

export default defineComponent({
  name: 'Home',
  props: {
  },
  components: { Campaign, Schedule },
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