<template>
  <div v-if="isLoading">now loading</div>
  <div v-else :class="$style.container">
    <div v-if="followRequestsFromMe.length === 0">送信済みのフォローリクエストはありません</div>
    <div v-for="(fr, i) in followRequestsFromMe" :key="i">
      <user-list-item :user="fr.user">
        <template #supplement>
          <div :class="$style.day">{{ makeDay(fr.follow.created_at) }}</div>
        </template>
        <template #rightItem>
          <div :class="$style.iconContainer">
            <q-icon v-if="!fr.follow.deleted_at && fr.follow.allowed" name="done" size="24px" :class="['text-green']" />
            <q-icon v-else-if="!fr.follow.deleted_at" name="fiber_manual_record" size="16px" style="width: 26px;" :class="['text-warning']" />
            <q-icon v-else name="clear" size="24px" :class="['text-red']" />
          </div>
        </template>
      </user-list-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import { FollowWithUser } from '../../../types/root';
import { getFollowRequestsFromMe } from '../../../lib/api';
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
    const isLoading = ref(true)
    const followRequestsFromMe = ref<FollowWithUser[]>([])
    onMounted(async () => {
      isLoading.value = true
      followRequestsFromMe.value = (await getFollowRequestsFromMe()).sort((a, b) => moment(b.follow.created_at).diff(a.follow.created_at))
      isLoading.value = false
    })
    const makeDay = (str: string) => {
      const d = moment(str)
      return d.format('MM/DD hh:mm')
    }
    return { followRequestsFromMe, makeDay, isLoading }
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
  justify-content: center;
  display: flex;
  width: 24px;
  height: 24px;
}

.day {
  margin-left: auto;
}
</style>
