<template>
  <div :class="$style.container" @click="open">
    <div :class="$style.wrapper">
      <div :class="$style.title">{{ title }}</div>
      <q-icon name="open_in_new" size="20px" :class="$style.icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Link',
  props: {
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  setup(props) {
    const open = () => {
      window.open(props.url)
    }
    return { open }
  }
});
</script>

<style lang="scss" module>
.container {
  color: #0366d6;
  cursor: pointer;
  height: 28px;
  padding-bottom: -1px;
  :hover {
    color: navy;
    border-bottom: thin solid navy;
    .title {
      border-bottom: none;
    }
    .icon {
      border-bottom: none;
    }
  }
}
.wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.title {
  font-size: 20px;
}
</style>