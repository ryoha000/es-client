<template>
  <q-card dark :class="$style.container" @click="onClick">
    <q-img :src="cardInfo.image" :class="$style.image" :img-style="{backgroundPositionY: `${topDiff}%`}" />
    <q-card-section :class="$style.section" @click.stop="onClickContent">
      <div :class="$style.title">{{ cardInfo.title }}</div>
      <div :class="$style.supplement">{{ cardInfo.supplement }}</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, watchEffect, ref, computed } from '@vue/composition-api';
import { CardInfo } from './HorizontalScroll.vue'

export default defineComponent({
  name: 'GameCard',
  props: {
    cardInfo: { type: Object as PropType<CardInfo>, required: true }
  },
  components: {
  },
  setup(props) {
    const onClick = () => {
      window.open(props.cardInfo.url)
    }
    const onClickContent = () => {
      window.open(props.cardInfo.contentUrl ?? props.cardInfo.url)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const faceDetector = new (window as any).FaceDetector({
      maxDetectedFaces: 1,
      fastMode: false
    });
    const height = ref<number>()
    const face = ref<{ top: number; bottom: number }>()
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    watchEffect(async () => {
      const imgBlob = await (await fetch(props.cardInfo.image)).blob()
      const imageBitmap = await createImageBitmap(imgBlob)
      height.value = imageBitmap.height
      try {
        face.value = (await faceDetector.detect(imageBitmap))?.[0]?.boundingBox
      } catch (e) {
        console.error('Face detection failed:', e);
      }
    })
    const topDiff = computed(() => face.value &&height.value ? (face.value.top + face.value.bottom)/2/height.value*100 : 50)

    return { onClick, onClickContent, topDiff }
  }
});
</script>

<style lang="scss" module>
.container {
  max-height: 220px;
  max-width: 250px;
  cursor: pointer;
}
.section {
  padding: 8px;
}
.image {
  height: 150px;
  width: 250px;
}
.title {
  font-size: 20px;
  font-weight: bold;
  word-wrap: none;
  overflow: hidden;
  white-space: nowrap;
  width: 240px;
  text-overflow: ellipsis;
}
.supplement {
  overflow: hidden;
  white-space: nowrap;
  width: 240px;
  text-overflow: ellipsis;
}
</style>
