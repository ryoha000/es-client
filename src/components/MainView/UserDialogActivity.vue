<template>
  <div :class="$style.container">
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
