<template>
  <div :class="$style.container">
    <div v-if="followRequestsFromMe.length === 0">未対応のフォローリクエストはありません</div>
    <div v-for="(fr, i) in followRequestsFromMe" :key="i">
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
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import { FollowWithUser } from '../../../types/root';
import { responseFollowRequest, getFollowRequestsFromMe } from '../../../lib/api';
import UserListItem from './UserListItem.vue'
import moment from 'moment'

export default defineComponent({
  name: 'FollowRequestItem',
  props: {
  },
  components: {
    UserListItem
  },
  setup() {
    const followRequestsFromMe = ref<FollowWithUser[]>([])
    onMounted(async () => {
      followRequestsFromMe.value = await getFollowRequestsFromMe()
    })
    const makeDay = (str: string) => {
      const d = moment(str)
      return d.format('YYYY-MM-DD')
    }
    const responseFollow = async (id: string, isAccept: boolean) => {
      await responseFollowRequest(id, isAccept)
      followRequestsFromMe.value.filter(v => v.follow.id !== id)
    }
    return { followRequestsFromMe, makeDay, responseFollow }
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
