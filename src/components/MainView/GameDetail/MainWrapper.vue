<template>
  <div :class="$style.container">
    <div :class="$style.button">
      <play-button />
      <div :class="$style.playTime">{{ playTimeString }}</div>
    </div>
    <div :class="$style.Link">
      <link-c
        v-for="(link, i) in links" :key="i"
        :url="link.url"
        :title="link.title"
        :class="$style.item"
      />
    </div>
    <game-info :class="$style.gameInfo" :creators="creators" />
    <score-c :class="$style.score" :score="score "/>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import LinkC from './Link.vue'
import PlayButton from './PlayButton.vue'
import GameInfo, { CreatorInfo } from './GameInfo.vue'
import ScoreC, { Score } from './Score.vue'
import useScraping from '../../use/useScraping'
import useJson from '../../use/useJson';
import store from 'src/store'

export default defineComponent({
  name: 'MainWrapper',
  props: {
  },
  components: {
    LinkC,
    PlayButton,
    GameInfo,
    ScoreC,
  },
  setup() {
    const gameDetail = computed(() => store.state.domain.gameDetail)
    const { getSeiyaURL } = useScraping()
    const links = computed(() => [
      { title: 'OHP', url: gameDetail.value?.officialHomePage ?? '' },
      { title: 'ErogameSpace', url: `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${gameDetail.value?.id ?? ''}` },
      { title: '誠也の部屋', url: getSeiyaURL(gameDetail.value?.name ?? '', store.state.app.seiya) }
    ])
    
    const score = computed<Score>(() => ({
      median: gameDetail.value?.median ?? 0,
      average: gameDetail.value?.average ?? 0,
      count: gameDetail.value?.count ?? 0,
    }))
    const creators = computed<CreatorInfo>(() => ({
      gengas: gameDetail.value?.gengas ?? [],
      sinarios: gameDetail.value?.sinarios ?? [],
      seiyus: gameDetail.value?.seiyus ?? [],
    }))
    const { getHistory } = useJson()
    const playTimeString = ref('')
    onMounted(async () => {
      const histories = await getHistory()
      let playTime = 0
      for (const his of histories) {
        if (his.id === gameDetail.value?.id) {
          playTime += his.time
        }
      }
      playTimeString.value = `プレイ時間: ${Math.floor(playTime / 1000 / 60 / 60)}時間 ${Math.round((playTime / 1000 / 60) % 60)}分`
    })
    return { links, score, playTimeString, creators }
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
  display: flex;
}
.playTime {
  align-self: flex-end;
  margin-left: 24px;
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
  margin-bottom: 8px;
}
.score {
  position: absolute;
  margin-right: 24px;
  right: 0;
  top: 0;
}
</style>
