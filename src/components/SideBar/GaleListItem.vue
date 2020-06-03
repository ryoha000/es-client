<template>
  <div :class="$style.container">
    <q-list dark bordered separator dense>
      <q-item v-for="(path, i) in games" :key="i" clickable v-ripple style="padding: 0;width: 231px;" @click="onClick">
        <q-item-section style="padding-right: 0;min-width: 0;" avatar>
          <q-avatar square>
            <img :src="'data:image/png;base64,' + path.icon">
          </q-avatar>
        </q-item-section>
        <q-item-section :class="$style.titleWrapper"><div :class="$style.title">{{ path.path }}</div></q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { ListGame } from '../../types/root';

export default defineComponent({
  name: 'GameListItem',
  props: {
    title: { type: String, required: true },
    games: { type: Array as PropType<ListGame[]>, default: [] }
  },
  components: {
  },
  setup(_, context) {
    const onClick = () => {
      context.emit('game', 28992)
    }
    return { onClick }
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titleWrapper {
  overflow: hidden;
  width: 183px;
  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    width: 183px;
    margin-left: 8px;
    font-size: 16px;
  }
}

</style>