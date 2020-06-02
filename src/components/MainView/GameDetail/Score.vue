<template>
  <table flat bordered :class="$style.container">
    <thead :class="$style.thread">
      <tr>
        <th colspan="1">
          <div class="row no-wrap items-center">
            <q-img
              style="width: 32px"
              :ratio="1"
              class="rounded-borders"
              src="../../../statics/icons/es_favicon.png"
            />
            <div class="text-h4 q-ml-md">Score</div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody :class="$style.tbody">
      <tr>
        <td>中央値</td>
        <td>{{ score.median }}</td>
      </tr>
      <tr>
        <td>平均値</td>
        <td>{{ score.average }}</td>
      </tr>
      <tr>
        <td>データ数</td>
        <td>{{ score.count }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

export interface Score {
  median: number,
  average: number,
  count: number
}

export default defineComponent({
  name: 'Score',
  props: {
    score: {
      type: Object as PropType<Score>,
      required: true
    }
  },
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.container {
  width: 200px;
  background-color: snow;
  color: black;
  box-shadow: none;
  border-collapse: separate;
  border-spacing: 0;
  padding: 0 8px;
  border-radius: 8px;
}

.tbody {
  background: snow;
  :nth-child(n) {
    height: 36px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
}
</style>
