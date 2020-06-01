<template>
  <div>
    <campaign />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import Campaign from '../components/MainView/Home/Campaign/Campaign.vue'

export default defineComponent({
  name: 'Home',
  props: {
  },
  components: {
    Campaign
  },
  setup() {
    return
  }
});
</script>
