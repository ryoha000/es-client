<template>
  <table flat bordered :class="$style.container">
    <thead :class="$style.thread">
      <tr>
        <th colspan="1">
          <div class="row no-wrap items-center">
            <q-img
              style="width: 40px"
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
        <td>159</td>
      </tr>
      <tr>
        <td>平均値</td>
        <td>237</td>
      </tr>
      <tr>
        <td>データ数</td>
        <td>262</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Score',
  props: {
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
  padding: 8px;
  border-radius: 8px;
}

.thread {
  border-bottom: 100px solid rgba(0, 0, 0, 0.12);
}

.tbody {
  background: snow;
  :nth-child(n) {
    height: 36px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
}
</style>
