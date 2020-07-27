<template>
  <div>
      <link-c
        :title="campaign.name"
        :icon="false"
        :url="campaign.url"
        :class="$style.link"
      />
    <div v-if="campaign.games.length > 0" :class="$style.wrapper">
      <horizontal-scroll :cardInfos="cardInfos" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@vue/composition-api';
import GameCard from '../../GameCard.vue'
import HorizontalScroll, { CardInfo } from '../../HorizontalScroll.vue'
import { Campaign, CampaignGame } from '../../../../types/root';
import LinkC from '../../GameDetail/Link.vue'

const getUrl = (store: number, game: CampaignGame): string => {
  if (game.url) return game.url
  // dlSite
  if (store === 2) {
    return `https://www.dlsite.com/pro/work/=/product_id/${game.dlsite_id ?? ''}.html`
  }
  // Fanza
  if (store === 176) {
    return `https://dlsoft.dmm.co.jp/detail/${game.dmm ?? ''}`
  }
  // Gyutto
  if (store === 3) {
    return `http://gyutto.com/i/item${game.gyutto_id ?? ''}`
  }
  return `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${game.id}`
}

export default defineComponent({
  name: 'CampaignContent',
  props: {
    campaign: {
      type: Object as PropType<Campaign>,
      required: true
    }
  },
  components: { GameCard, HorizontalScroll, LinkC },
  setup(props) {
    const cardInfos = computed<CardInfo[]>(() =>
      props.campaign.games.map(game => ({
        title: game.gamename ?? '',
        supplement: game.content ?? '',
        image: `https://pics.dmm.co.jp/${game.dmm_genre ?? ''}/pcgame/${game.dmm ?? ''}/${game.dmm ?? ''}pl.jpg`,
        // image: '',
        url: getUrl(props.campaign.store ?? 0, game),
        contentUrl: `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${game.id}`,
        tooltip: `中央値: ${game.median}\n標準偏差: ${game.stdev}\nデータ数: ${game.count2}`
      }))
    )
    return { cardInfos }
  }
});
</script>

<style lang="scss" module>
.wrapper {
  margin-top: 6px;
}
.link {
  margin-top: 12px;
}
</style>
