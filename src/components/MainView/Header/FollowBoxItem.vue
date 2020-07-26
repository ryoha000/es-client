<template>
  <div v-if="isLoading">now loading</div>
  <div v-else :class="$style.container">
    <q-input hint="Readonly" :value="me.id" :dense="dense" readonly label="あなたのリクエスト用ID">
      <template v-slot:append>
        <q-icon :class="$style.icon" name="content_paste" @click="copy">
          <q-tooltip>
            {{ copyTip }}
          </q-tooltip>
        </q-icon>
      </template>
    </q-input>
    <div v-if="followRequests.length === 0">未対応のフォローリクエストはありません</div>
    <div v-for="(fr, i) in followRequests" :key="i">
      <user-list-item :user="fr.user">
        <template #supplement>
          <div :class="$style.day">{{ makeDay(fr.follow.created_at) }}</div>
        </template>
        <template #rightItem>
          <div :class="$style.iconContainer">
            <q-icon name="done" size="24px" :class="['text-green', $style.icon]" @click="responseFollow(fr.follow.id, true)" />
            <q-icon name="clear" size="24px" :class="['text-red', $style.icon]" @click="responseFollow(fr.follow.id, false)" />
          </div>
        </template>
      </user-list-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from '@vue/composition-api';
import { FollowWithUser } from '../../../types/root';
import { getFollowRequestsToMe, responseFollowRequest } from '../../../lib/api';
import UserListItem from './UserListItem.vue'
import moment from 'moment'
import store from 'src/store'
import { clipboard } from 'electron'

export default defineComponent({
  name: 'FollowBoxItem',
  props: {
  },
  components: {
    UserListItem
  },
  setup() {
    const me = computed(() => store.state.domain.me)
    const followRequests = ref<FollowWithUser[]>([])
    const isLoading = ref(true)
    onMounted(async () => {
      isLoading.value = true
      followRequests.value = await getFollowRequestsToMe()
      isLoading.value = false
    })
    const makeDay = (str: string) => {
      const d = moment(str)
      return d.format('YYYY-MM-DD')
    }
    const waiting = ref(false)
    const responseFollow = async (id: string, isAccept: boolean) => {
      if (!waiting.value) {
        waiting.value = true
        await responseFollowRequest(id, isAccept)
        followRequests.value = followRequests.value.filter(v => v.follow.id !== id)
        waiting.value = false
      }
    }
    const copyTip = ref('copy')
    const copy = () => {
      clipboard.writeText(me.value?.id ?? '')
      copyTip.value = 'copied!'
      setTimeout(() => {
        copyTip.value = 'copy'
      }, 1000);
    }
    return { followRequests, makeDay, responseFollow, isLoading, waiting, me, copy, copyTip }
  }
});
</script>

<style lang="scss" module>
.container {
  padding: 8px;
  overflow: hidden;
}

.iconContainer {
  align-items: center;
  display: flex;
}

.day {
  margin-left: auto;
}

.icon {
  cursor: pointer;
  margin-left: 4px;
}
</style>
