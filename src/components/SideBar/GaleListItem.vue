<template>
  <div :class="$style.container">
    <q-list dark bordered separator dense>
      <q-item clickable v-ripple style="padding: 0;" @click="onClick">
        <q-item-section style="padding-right: 0;min-width: 0;" avatar>
          <q-avatar square>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>
        <q-item-section :class="$style.titleWrapper"><div :class="$style.title">{{ title }}</div></q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import useScraping from '../use/useScraping'

export default defineComponent({
  name: 'GameListItem',
  props: {
    title: { type: String, required: true }
  },
  components: {
  },
  setup(_, context) {
    const { getGameDetail } = useScraping()
    const onClick = async () => {
      const game = await getGameDetail(28992)
      console.log(game)
      context.emit('game', game)
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
  width: 100%;
  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-left: 8px;
    font-size: 16px;
  }
}

</style>