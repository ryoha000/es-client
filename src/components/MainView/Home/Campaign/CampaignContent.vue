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
import HorizontalScroll from '../../HorizontalScroll.vue'
import { Campaign } from '../../../../types/root';
import LinkC from '../../GameDetail/Link.vue'

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
    const cardInfos = computed(() =>
      props.campaign.games.map(game => ({
        title: game.title,
        supplement: game.content,
        image: '',
        contentUrl: `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${game.id}`
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