<template>
  <div :class="$style.container">
    <div v-for="(fr, i) in followRequests" :key="i" :class="$style.itemContainer">
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
import { FollowWithUser, User } from '../../../types/root';
import { getFollowRequests, responseFollowRequest } from '../../../lib/api';
import UserListItem from './UserListItem.vue'
import moment from 'moment'

export default defineComponent({
  name: 'FollowBoxItem',
  props: {
  },
  components: {
    UserListItem
  },
  setup() {
    const followRequests = ref<FollowWithUser[]>([])
    onMounted(async () => {
      followRequests.value = await getFollowRequests()
    })
    const makeDay = (str: string) => {
      const d = moment(str)
      return d.format('YYYY-MM-DD')
    }
    const responseFollow = async (id: string, isAccept: boolean) => {
      await responseFollowRequest(id, isAccept)
      followRequests.value.filter(v => v.follow.id !== id)
    }
    return { followRequests, makeDay, responseFollow }
  }
});
</script>

<style lang="scss" module>
.container {
  padding: 8px;
  overflow: hidden;
}
.avater {
  justify-self: center;
  align-self: center;
}

.itemContainer {
  align-items: center;
  display: flex;
  animation: SlideIn 0.5s 1;
}

.iconContainer {
  align-items: center;
  display: flex;
}

.userContainer {
  align-items: center;
  display: flex;
  flex: 0 0 calc( 100% - 48px );
  cursor: pointer;
}

.userName {
  margin-left: 8px;
  font-size: 20px;
}

.day {
  margin-left: auto;
}

.icon {
  cursor: pointer;
  margin-left: 4px;
}

@keyframes SlideIn {
  0% {
    opacity: 0;/*初期状態では透明に*/
    transform: translateX(32px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
