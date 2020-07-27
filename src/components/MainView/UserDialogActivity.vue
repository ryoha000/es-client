<template>
  <div :class="$style.container">
    <div :class="$style.comment">一言: {{ userDetail.user.comment ? userDetail.user.comment : '未設定'}}</div>
    <user-dialog-activity-item label="プレイしたゲーム" :timelines="userDetail.play" />
    <user-dialog-activity-item label="レビューしたゲーム" :timelines="userDetail.review" />
    <user-dialog-activity-item label="リストに入れたゲーム" :timelines="userDetail.list" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { UserDetail } from '../../types/root';
import UserDialogActivityItem from './UserDialogActivityItem.vue'

export default defineComponent({
  name: 'UserDialogActivity',
  props: {
    userDetail: {
      types: Object as PropType<UserDetail>,
      required: true,
    }
  },
  components: { UserDialogActivityItem },
  setup() {
    return {  }
  }
});
</script>

<style lang="scss" module>
.container {
  padding: 8px;
  overflow: hidden;
}

.comment {
  font-size: 1.125rem;
  margin-left: 16px;
  margin-bottom: 16px;
}
</style>
