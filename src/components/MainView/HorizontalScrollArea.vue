<template>
  <div :class="$style.container">
    <q-scroll-area
      horizontal
      dark
      ref="scrollRef"
      @scroll="scrollarea"
      style="height: 240px; width: 100%;"
      :class="$style.scrollContainer"
    >
      <slot name="iter" />
    </q-scroll-area>
    <q-btn :class="$style.rightButton" color="transparent" @click="onRightClick">
      <q-icon name=keyboard_arrow_right />
    </q-btn>
    <q-btn :class="$style.leftButton" color="transparent" @click="onLeftClick">
      <q-icon name=keyboard_arrow_left />
    </q-btn>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, ref } from '@vue/composition-api';

const sleep = (msec: number)=> new Promise(resolve => setTimeout(resolve, msec));

export default defineComponent({
  name: 'HorizontalScrollArea',
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scrollRef = ref<any | undefined>()
    const nowPosition = ref(0)
    const onRightClick = async () => {
      for (let i = 0; i < 10; i++) {
        await sleep(10)
        scrollRef.value.setScrollPosition(nowPosition.value + 100)
      }
    }
    const onLeftClick = async () => {
      for (let i = 0; i < 10; i++) {
        await sleep(10)
        scrollRef.value.setScrollPosition(nowPosition.value - 100)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scrollarea = (position: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      nowPosition.value = position.horizontalPosition
    }
    return {
      onRightClick,
      onLeftClick,
      scrollRef,
      scrollarea
    }
  }
});
</script>

<style lang="scss" module>
.container {
  position: relative;
}

.rightButton {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
}

.leftButton {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.scrollContainer {
  :first-child {
    overflow: hidden;
  }
}
</style>