<template>
  <q-dialog v-model="isOpen" @before-hide="close" >
    <q-card style="width: 390px" :class="$style.cardContainer" >
      <q-card-section>
        <div class="text-h6">フォロー</div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <q-tabs
            v-model="tab"
            narrow-indicator
            dense
            align="justify"
          >
            <q-tab class="text-blue" name="box" icon="move_to_inbox"  />
            <q-tab class="text-blue" name="send" icon="send" />
            <q-tab class="text-blue" name="followees" icon="loyalty" />
            <q-tab class="text-blue" name="followers" icon="people_alt" />
          </q-tabs>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <follow-box-item v-if="tab === 'box'" />
          <div v-if="tab === 'followees'">
            <div v-if="followees.length === 0" :class="$style.emptyText">フォローしているユーザーはいません</div>
            <user-list-item v-for="(fee, i) in followees" :key="i" :user="fee" />
          </div>
          <div v-if="tab === 'followers'">
            <div v-if="followers.length === 0" :class="$style.emptyText">フォローされているユーザーはいません</div>
            <user-list-item v-for="(fer, i) in followers" :key="i" :user="fer" />
          </div>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import FollowBoxItem from './FollowBoxItem.vue'
import UserListItem from './UserListItem.vue'
import { User } from '../../../types/root';
import { getFollowers, getFollowees } from '../../../lib/api';
import store from '../../../store';

export default defineComponent({
  name: 'FollowDialog',
  props: {
    isOpen: {
      type: Boolean, required: true
    },
  },
  components: { FollowBoxItem, UserListItem },
  setup(props, context) {
    const close = () => {
      context.emit('close')
    }

    const tab = ref('box')

    const followers = ref<User[]>([])
    const followees = ref<User[]>([])
    onMounted(async () => {
      await Promise.all([
        followers.value = await getFollowers(store.state.domain.me?.id ?? ''),
        followees.value = await getFollowees(store.state.domain.me?.id ?? ''),
      ])
    })
    return { close, tab, followees, followers }
  }
});
</script>

<style lang="scss" module>
.cardContainer {
  padding: 8px;
  height: 70%;
  overflow-x: hidden !important;
}

.emptyText {
  font-size: 1.15rem;
}
</style>
