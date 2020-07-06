<template>
  <div :class="$style.container">
    <q-expansion-item
      expand-separator
      :class="$style.container"
      label="エロゲーマーアクティビティ"
      default-opened
      header-style="font-size: 20px;"
    >
      <horizontal-scroll-area>
        <template #iter>
          <div class="row no-wrap">
            <div v-for="(tl, i) in timelines" :key="i" :class="$style.card">
              <game-card :cardInfo="cardInfo_by_tl(tl)">
                <template #cardSupplement>
                  <div :class="$style.supplements">
                    <q-avatar size="32px" :class="$style.avater" >
                      <img :src="tl.user.icon_url ? tl.user.icon_url : '../../../../statics/icons/user-pict.png'">
                    </q-avatar>
                    <div>{{ tl.user.display_name }}</div>
                    <div :class="$style.typeIcon" @mouseenter="(event) => over(event, tl)" @mouseleave="leave">
                      <q-icon :name="logIconByTimeline(tl)" size="32px" />
                    </div>
                  </div>
                </template>
              </game-card>
            </div>
          </div>
        </template>
      </horizontal-scroll-area>
    </q-expansion-item>
    <portal to="tooltip" v-if="isHover">
      <div :class="[isLeaveAnime ? $style.leaveTooltip : $style.inTooltip, $style.tooltip]">
        <div :class="$style.tooltipContent">{{ tooltipContent }}</div>
      </div>
    </portal>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api';
import store from 'src/store';
import GameCard from '../../GameCard.vue';
import { LogType, MaskedTimeline } from 'src/types/root';
import { CardInfo } from '../../HorizontalScroll.vue';
import useTooltipContent from './use/useTooltipContent';
import HorizontalScrollArea from '../../HorizontalScrollArea.vue'

export default defineComponent({
  name: 'Timeline',
  components: { GameCard, HorizontalScrollArea },
  setup() {
    const timelines = computed(() => store.state.domain.maskedTimelines)
    const cardInfo_by_tl = (tl: MaskedTimeline): CardInfo => {
      return {
        title: tl.game.gamename ?? '',
        supplement: '',
        // image: `https://pics.dmm.co.jp/${game.dmm_genre ?? ''}/pcgame/${game.dmm ?? ''}/${game.dmm ?? ''}pl.jpg`,
        image: '',
        url: tl.timeline.log_type === LogType.Review
          ? `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/user_game.php?user=${tl.user.es_user_id}&game=${tl.game.id}`
          : undefined,
      }
    }
    const logIconByTimeline = (tl: MaskedTimeline) => {
      if (tl.timeline.log_type === LogType.Play) return 'play_arrow'
      if (tl.timeline.log_type === LogType.Review) return 'chat'
      if (tl.timeline.log_type === LogType.List) return 'queue'
      return ''
    }

    const isHover = ref(false)
    const isLeaveAnime = ref(false)
    const tooltipContent = ref('')
    const over = (event: MouseEvent, tl: MaskedTimeline) => {
      const { makeContent } = useTooltipContent(tl)
      if (isLeaveAnime.value) {
        isHover.value = false
        isLeaveAnime.value = false
      }
      isHover.value = true
      tooltipContent.value = makeContent()
      store.commit.app.setTooltipPoint({ x: event.clientX, y: event.clientY })
    }
    const leave = () => {
      isLeaveAnime.value = true
      setTimeout(() => {
        if (isLeaveAnime.value) {
          isHover.value = false
        }
        isLeaveAnime.value = false
      }, 500)
    }
    return {
      timelines,
      cardInfo_by_tl,
      over,
      leave,
      isHover,
      isLeaveAnime,
      tooltipContent,
      logIconByTimeline
    }
  }
});
</script>

<style lang="scss" module>
.title {
  font-size: 22px;
  margin-left: 8px;
  margin-bottom: 8px;
}

.avater {
  justify-self: center;
  margin-right: 8px;
  align-self: center;
  cursor: pointer;
}

.card {
  width: 260px;
  height: 250px;
  margin-right: 8px;
  overflow: hidden;
}

.supplements {
  display: flex;
  align-items: center;
}

.typeIcon {
  margin-left: auto;
  z-index: 3;
}

.tooltip {
  width: 160px;
  // height: 200px;
  max-height: 200px;

  border-radius: 8px;
  background: rgba(0, 0, 0, 0.7);
}

.inTooltip {
  animation: SlideIn 0.5s 1;
}

.leaveTooltip {
  animation: SlideOut 0.5s 1;
}

.tooltipContent {
  white-space: pre-wrap;
  padding: 8px;
}

/* CSSアニメーションの設定 */
@keyframes SlideIn {
  0% {
    opacity: 0;/*初期状態では透明に*/
    transform: translateX(16px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes SlideOut {
  0% {
    opacity: 1;/*初期状態では透明に*/
    transform: translateX(0px);
  }
  100% {
    opacity: 0;
    transform: translateX(-16px);
  }
}

.container {
  width: 100%;
}
</style>