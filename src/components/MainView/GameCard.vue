<template>
  <q-card dark :class="$style.container">
    <img height="150px" width="250px" :src="cardInfo.image">
    <q-card-section :class="$style.section">
      <div ref="titleRef" :class="$style.title">{{ cardInfo.title }}</div>
      <div ref="supplementRef" class="text-subtitle2">{{ cardInfo.supplement }}</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from '@vue/composition-api';
import { CardInfo } from './HorizontalScroll.vue'

export default defineComponent({
  name: 'GameCard',
  props: {
    cardInfo: { type: Object as PropType<CardInfo>, required: true }
  },
  components: {
  },
  setup() {
    const titleRef = ref<HTMLDivElement | undefined>()
    const nowTitleHeight = ref(0)
    const supplementRef = ref<HTMLDivElement | undefined>()
    const nowSupplementHeight = ref(0)
    onMounted(() => {
      nowTitleHeight.value = titleRef.value?.getBoundingClientRect().height ?? 0
      nowSupplementHeight.value = supplementRef.value?.getBoundingClientRect().height ?? 0
    })
    return {titleRef, supplementRef}
  }
});
</script>

<style lang="scss" module>
.container {
  max-height: 220px;
  max-width: 250px;
}
.section {
  padding: 8px;
}
.title {
  font-size: 20px;
  font-weight: bold;
  word-wrap: none;
}
</style>