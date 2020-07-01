<template>
  <q-scroll-area :style="styles.container">
    <campaign-c :class="$style.item" />
    <schedule :class="$style.item" :sellSchedules="sellSchedules" />
  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, reactive, Ref, onMounted } from '@vue/composition-api';
import CampaignC from '../components/MainView/Home/Campaign/Campaign.vue'
import Schedule from '../components/MainView/Home/Schedule/Schedule.vue'
import { SellSchedule } from '../types/root';
import { makeStyles } from '../lib/style'

const useStyles = (windowHeight: Ref<number>) => 
  reactive({
    container: makeStyles(() => ({
        height: `calc( ${windowHeight.value}px - 52px )`
      })
    )
  })

export default defineComponent({
  name: 'Home',
  props: {
    sellSchedules: {
      type: Array as PropType<SellSchedule[]>,
      default: []
    }
  },
  components: { CampaignC, Schedule },
  setup() {
    const windowHeight = ref(window.innerHeight)
    const styles = useStyles(windowHeight)
    onMounted(() => {
      window.addEventListener('resize', () => {
        windowHeight.value = window.innerHeight
      })
    })
    return { styles }
  }
});
</script>

<style lang="scss" module>
.item {
  margin-top: 8px;
}
</style>