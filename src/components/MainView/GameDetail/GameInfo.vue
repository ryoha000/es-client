<template>
  <div :class="$style.container">
    <div :class="$style.column">
      <div>原画:</div>
      <div>シナリオ:</div>
      <div>声優:</div>
    </div>
    <div :class="$style.value">
      <div>八宝備仁</div>
      <div>吉祥寺ドロレス</div>
      <div>杏子御津(覡 夕摩) , 篠原ゆみ(覡 夕莉) , ヒマリ(陽茉莉)(御殿場 鏡子) , 葵時緒(稲森 はる) , 真中海(蓮華) , 榛名れん(藤堂 咲) , 越雪光(覡 礼次郎) , このは(声優)(鈴森 いちか)</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'GameInfo',
  props: {
  },
  components: {  },
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  font-size: 18px;
}
.column {
  flex: 0 0 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 16px;
}
.value {
  flex: 1 1 calc( 100% - 96px );
}
</style>