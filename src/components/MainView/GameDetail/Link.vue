<template>
  <div :class="$style.container" @click="open">
    <div :class="$style.wrapper">
      <div :class="$style.title" :style="styles.title">{{ title }}</div>
      <q-icon v-if="icon" name="open_in_new" size="20px" :class="$style.icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
import { makeStyles } from '../../../lib/style'

const useStyles = (props: { fontSize: number } ) => 
  reactive({
    title: makeStyles(theme => ({
        fontSize: `${props.fontSize}px`
      })
    )
  })

export default defineComponent({
  name: 'Link',
  props: {
    title: { type: String, required: true },
    url: { type: String, required: true },
    fontSize: { type: Number, default: 20 },
    icon: { type: Boolean, default: true }
  },
  setup(props) {
    const open = () => {
      window.open(props.url)
    }
    const styles = useStyles(props)
    return { open, styles }
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
</style>