<template>
  <div :class="$style.supplements">
    <div
      :class="$style.supplementsUser"
      @click="openUserDialog"
    >
      <q-avatar size="32px" :class="$style.avater">
        <img :src="userIcon" />
      </q-avatar>
      <div>{{ tl.user.display_name }}</div>
    </div>
    <div
      :class="$style.typeIcon"
      @mouseenter="event => over(event)"
      @mouseleave="leave"
    >
      <q-icon :name="logIcon" size="32px" />
    </div>
    <user-dialog
      :isOpen="isOpenUserDialog"
      @close="closeUserDialog"
      :id="tl.user.id"
      v-if="isOpenUserDialog"
    />
    <tooltip
      :isHover="isHover"
      :isLeaveAnime="isLeaveAnime"
      :tooltipContent="tooltipContent"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from '@vue/composition-api';
import store from 'src/store';
import GameCard from '../../GameCard.vue';
import { LogType, MaskedTimeline } from 'src/types/root';
import useTooltipContent from './use/useTooltipContent';
import HorizontalScrollArea from '../../HorizontalScrollArea.vue';
import UserDialog from '../../UserDialog.vue';
import Tooltip from '../../Tooltip.vue';
import DefaultIcon from 'src/statics/icons/user_pict.png';

export default defineComponent({
  name: 'TimelineSupplement',
  components: { GameCard, HorizontalScrollArea, Tooltip, UserDialog },
  props: {
    tl: {
      type: Object as PropType<MaskedTimeline>,
      required: true
    }
  },
  setup(props) {
    const logIcon = computed(() => {
      if (props.tl.timeline.log_type === LogType.Play) return 'play_arrow';
      if (props.tl.timeline.log_type === LogType.Review) return 'chat';
      if (props.tl.timeline.log_type === LogType.List) return 'queue';
      return '';
    })

    const isHover = ref(false);
    const isLeaveAnime = ref(false);
    const tooltipContent = ref('');
    const over = async (event: MouseEvent) => {
      if (props.tl.timeline.log_type === 1 && !props.tl.review) {
        await store.dispatch.domain.updateMaskedTimeline(props.tl.timeline.id)
      }
      const { makeContent } = useTooltipContent(props.tl);
      if (isLeaveAnime.value) {
        isHover.value = false;
        isLeaveAnime.value = false;
      }
      isHover.value = true;
      tooltipContent.value = makeContent();
      store.commit.app.setTooltipPoint({ x: event.clientX, y: event.clientY });
    };
    const leave = () => {
      isLeaveAnime.value = true;
      setTimeout(() => {
        if (isLeaveAnime.value) {
          isHover.value = false;
        }
        isLeaveAnime.value = false;
      }, 500);
    };

    const userIcon = computed(() => {
      if (props.tl.user.icon_url === '') {
        return DefaultIcon
      }
      return props.tl.user.icon_url ?? DefaultIcon
    })

    const isOpenUserDialog = ref(false);
    const openUserDialog = () => {
      isOpenUserDialog.value = true;
    };
    const closeUserDialog = () => {
      isOpenUserDialog.value = false;
    };
    return {
      over,
      leave,
      isHover,
      isLeaveAnime,
      tooltipContent,
      logIcon,
      isOpenUserDialog,
      openUserDialog,
      closeUserDialog,
      userIcon,
    };
  }
});
</script>

<style lang="scss" module>
.avater {
  justify-self: center;
  margin-right: 8px;
  align-self: center;
  cursor: pointer;
}

.supplements {
  display: flex;
  align-items: center;
}

.supplementsUser {
  display: flex;
  align-items: center;
}

.typeIcon {
  margin-left: auto;
  z-index: 3;
}
</style>
