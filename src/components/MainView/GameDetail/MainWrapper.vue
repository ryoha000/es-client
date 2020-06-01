<template>
  <div :class="$style.container">
    <div :class="$style.button">
      <play-button  />
    </div>
    <div :class="$style.Link">
      <link-c
        :class="$style.item"
        title="ErogameSpace"
        url="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/"
      />
      <link-c
        :class="$style.item"
        title="誠也の部屋"
        url="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/"
      />
      <link-c
        :class="$style.item"
        title="OHP"
        url="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/"
      />
    </div>
    <game-info :class="$style.gameInfo" />
    <score :class="$style.score" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import LinkC from './Link.vue'
import PlayButton from './PlayButton.vue'
import GameInfo from './GameInfo.vue'
import Score from './Score.vue'

export default defineComponent({
  name: 'MainWrapper',
  props: {
  },
  components: {
    LinkC,
    PlayButton,
    GameInfo,
    Score
  },
  setup() {
    return
  }
});
</script>

<style lang="scss" module>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
}
.button {
  margin-top: 16px;
}
.Link {
  display: flex;
}
.item {
  margin-top: 16px;
  margin-right: 16px;
}
.gameInfo {
  margin-top: 16px;
}
.score {
  position: absolute;
  margin-right: 24px;
  right: 0;
  top: 0;
}
</style>
