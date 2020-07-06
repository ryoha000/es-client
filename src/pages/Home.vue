<template>
  <q-scroll-area :style="styles.container">
    <timeline />
    <campaign-c :class="$style.item" />
    <schedule :class="$style.item" />
  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, Ref, onMounted } from '@vue/composition-api';
import CampaignC from '../components/MainView/Home/Campaign/Campaign.vue'
import Schedule from '../components/MainView/Home/Schedule/Schedule.vue'
import Timeline from '../components/MainView/Home/Timeline/Timeline.vue'
import { makeStyles } from '../lib/style'

const useStyles = (windowHeight: Ref<number>) => 
  reactive({
    container: makeStyles(() => ({
        height: `calc( ${windowHeight.value}px - 52px )`,
        paddingBottom: '16px'
      })
    ),
  })

export default defineComponent({
  name: 'Home',
  props: {
  },
  components: { Timeline, CampaignC, Schedule },
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