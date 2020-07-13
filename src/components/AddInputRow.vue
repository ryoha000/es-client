<template>
  <div :class="$style.container">
    <q-item v-for="(str, i) in strs" :key="i">
      <q-item-section>
        <div :class="$style.input">
          <q-input :value="str" @input="(value) => input(value, i)" />
          <q-btn flat round icon="close" @click="dicreaseRow(i)" />
        </div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn flat :class="$style.addBtn" round icon="add" @click="addRow" />
      </q-item-section>
    </q-item>
    <q-item :class="$style.confirmBtn">
      <q-item-section>
        <q-btn color="primary" :label="label" @click="confirm"/>
      </q-item-section>
    </q-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from '@vue/composition-api';

export default defineComponent({
  name: 'ChangeFolderPath',
  props: {
    initialStrs: {
      type: Array as PropType<string[]>,
      default: [''],
    },
    label: {
      type: String, required: true
    }
  },
  setup(props, context) {
    const strs = ref<string[]>([''])
    onMounted(() => {
      strs.value = props.initialStrs
    })
    const input = (value: string, i: number) => {
      strs.value = strs.value.map((v, ind) => {
        if (ind === i) return value
        else return v
      })
    }
    const addRow = () => {
      strs.value.push('')
    }
    const dicreaseRow = (i: number) => {
      strs.value.splice(i, 1)
    }
    const confirm = () => {
      context.emit('confirm', strs.value)
    }
    return { strs, input, addRow, dicreaseRow, confirm }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
}

.input {
  display: flex;
  :first-child {
    width: 320px;
  }
  :nth-child(2) {
    width: 42px;
    height: 42px;
  }
}

.addBtn {
  margin: 0 auto;
  width: 42px;
}

.confirmBtn {
  margin-top: auto;
}
</style>
