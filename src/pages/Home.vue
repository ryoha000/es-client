<template>
  <q-scroll-area :style="styles.container">
    <timeline />
    <list v-if="me"/>
    <campaign-c :class="$style.item" />
    <schedule :class="$style.item" />
  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, Ref, onMounted, computed } from '@vue/composition-api';
import CampaignC from '../components/MainView/Home/Campaign/Campaign.vue'
import Schedule from '../components/MainView/Home/Schedule/Schedule.vue'
import List from '../components/MainView/Home/List/List.vue'
import Timeline from '../components/MainView/Home/Timeline/Timeline.vue'
import { makeStyles } from '../lib/style'
import store from '../store';

const useStyles = (windowHeight: Ref<number>) => 
  reactive({
    container: makeStyles(() => ({
        height: `calc( ${windowHeight.value}px - 52px )`,
        // paddingBottom: '16px'
      })
    ),
  })

export default defineComponent({
  name: 'Home',
  props: {
  },
  components: { Timeline, CampaignC, Schedule, List },
  setup() {
    const windowHeight = ref(window.innerHeight)
    const styles = useStyles(windowHeight)
    const me = computed(() => store.state.domain.me)
    onMounted(() => {
      window.addEventListener('resize', () => {
        windowHeight.value = window.innerHeight
      })
    })
    return { styles, me }
  }
});
</script>

<style lang="scss" module>
.item {
  margin-top: 8px;
}
</style>