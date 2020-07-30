<template>
  <q-card dark :class="$style.container" @click="onClick" @click.right.prevent="rightClick">
    <q-img :src="cardInfo.image" :class="$style.image" contain />
    <q-card-section :class="$style.section" @click.stop="onClickContent">
      <div :class="$style.title">{{ cardInfo.title }}</div>
      <slot name="cardSupplement" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, PropType } from '@vue/composition-api';
import { CardInfo } from './HorizontalScroll.vue'
import { remote } from 'electron'

export default defineComponent({
  name: 'GameCard',
  props: {
    cardInfo: { type: Object as PropType<CardInfo>, required: true }
  },
  components: {
  },
  setup(props, context) {
    const onClick = async () => {
      if (props.cardInfo.url) {
        await remote.shell.openExternal(props.cardInfo.url)
      }
    }
    const onClickContent = async () => {
      if (props.cardInfo.url || props.cardInfo.contentUrl) {
        await remote.shell.openExternal(props.cardInfo.contentUrl ?? props.cardInfo.url ?? '')
      }
    }

    const rightClick = () => {
      context.emit('rightClick', props.cardInfo.title)
    }
    return { onClick, onClickContent, rightClick }
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
  font-size: 16px;
  word-wrap: none;
  overflow: hidden;
  white-space: nowrap;
  width: 240px;
  text-overflow: ellipsis;
}
</style>