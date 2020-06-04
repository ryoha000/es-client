<template>
  <div :class="$style.container">
    <q-list dark  separator dense>
      <q-item
        v-for="(path, i) in listGames" :key="i"
        clickable
        v-ripple
        style="padding: 0;width: 231px;"
        @click="onClick(path.id)"
      >
        <q-item-section style="padding-right: 0;min-width: 0;" avatar>
          <q-avatar square>
            <img :src="'data:image/png;base64,' + path.icon">
          </q-avatar>
        </q-item-section>
        <q-item-section :class="$style.titleWrapper"><div :class="$style.title">{{ gameName(path.id) }}</div></q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@vue/composition-api';
import { ListGame, DMM } from '../../types/root';

export default defineComponent({
  name: 'GameListItem',
  props: {
    games: { type: Array as PropType<ListGame[]>, required: true },
    allGames: { type: Object as PropType<Record<number, DMM>>, required: true }
  },
  components: {
  },
  setup(props, context) {
    const onClick = (id: number) => {
      context.emit('game', id)
    }
    const allDmmGames = computed(() => props.allGames)
    const gameName = (id: number) => {
      if (allDmmGames.value[id]) {
        return allDmmGames.value[id].name
      }
      return ''
    }
    const listGames = computed(() => props.games)
    return { onClick, listGames, gameName, allDmmGames }
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