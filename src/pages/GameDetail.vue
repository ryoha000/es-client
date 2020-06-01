<template>
  <div :class="$style.container">
    <img :class="$style.image" src="../statics/icons/ESClient_demo_image.jpg" />
    <div :class="$style.wrapTitle">
      <div :class="$style.title">タイトル</div>
      <div :class="$style.titleInfo"><div>メーカー</div></div>
      <div :class="$style.titleInfo"><div>(2020-05-29)</div></div>
    </div>
    <main-wrapper />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import MainWrapper from '../components/MainView/GameDetail/MainWrapper.vue'

export default defineComponent({
  name: 'GameDetail',
  props: {
  },
  components: {
    MainWrapper
  },
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
}
.image {
  align-self: center;
}
.wrapTitle {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
}
.title {
  font-size: 24px;
  margin-left: 16px;
}
.titleInfo {
  font-size: 20px;
  margin-left: 16px;
  color: #0366d6;
  cursor: pointer;
  :hover {
    color: navy;
    border-bottom: thin solid navy;
  }
}
</style>