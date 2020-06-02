<template>
  <div :class="$style.container">
    <div :class="$style.column">
      <div>原画:</div>
      <div>シナリオ:</div>
      <div>声優:</div>
    </div>
    <div :class="$style.value">
      <div :class="$style.wrapper">
        <link-c
          v-for="(genga, i) in creators.gengas" :key="i"
          :title="genga.name"
          :icon="false"
          :fontSize="18"
        />
      </div>
      <div :class="$style.wrapper">
        <link-c
          v-for="(sinario, i) in creators.sinarios" :key="i"
          :title="sinario.name"
          :icon="false"
          :fontSize="18"
        />
      </div>
      <div :class="$style.wrapper">
        <div :class="$style.wrapper" v-for="(seiyu, i) in creators.seiyus" :key="i">
          <link-c
            :title="seiyu.name"
            :icon="false"
            :fontSize="18"
          />
          <span v-if="seiyu.importance === 0" :class="$style.role0">({{ seiyu.role }})</span>
          <span v-if="seiyu.importance === 1" :class="$style.role1">({{ seiyu.role }})</span>
          <span v-if="seiyu.importance === 2" :class="$style.role2">({{ seiyu.role }})</span>
          <span v-if="creators.seiyus.length !== i + 1">&nbsp;,&nbsp;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { Creator, Seiyu } from '../../../types/root'
import LinkC from './Link.vue'

export interface CreatorInfo {
  gengas: Creator[]
  sinarios: Creator[]
  seiyus: Seiyu[]
}

export default defineComponent({
  name: 'GameInfo',
  props: {
    creators: {
      types: Object as PropType<CreatorInfo>,
      required: true
    }
  },
  components: {
    LinkC
  },
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
.wrapper {
  display: flex;
  flex-wrap: wrap;
}
.role0 {
  font-weight: bold;
}
.role1 {
  color: white;
}
.role2 {
  color: gray;
}
</style>