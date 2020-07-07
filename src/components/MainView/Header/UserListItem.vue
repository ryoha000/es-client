<template>
  <div :class="$style.container">
    <div :class="$style.userContainer" @click="openUserDialog">
      <q-avatar size="32px" :class="$style.avater" >
        <img :src="iconByUser(user)">
      </q-avatar>
      <div :class="$style.userName">{{ user.display_name }}</div>
      <div :class="$style.rightComponent">
        <slot name="supplement"  />
      </div>
    </div>
    <slot name="rightItem" />
    <user-dialog :isOpen="isOpenUserDialog" @close="closeUserDialog" :id="user.id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import { User } from '../../../types/root';
import UserDialog from '../UserDialog.vue'

export default defineComponent({
  name: 'UserListItem',
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    }
  },
  components: {
    UserDialog
  },
  setup() {
    const iconByUser = (user: User) => {
      return user.icon_url ?? '../../../statics/icons/user-pict.png'
    }
    const isOpenUserDialog = ref(false)
    const openUserDialog = () => {
      isOpenUserDialog.value = true
    }
    const closeUserDialog = () => {
      isOpenUserDialog.value = false
    }
    return { iconByUser, isOpenUserDialog, openUserDialog, closeUserDialog }
  }
});
</script>

<style lang="scss" module>
.container {
  align-items: center;
  display: flex;
  animation: SlideIn 0.5s 1;
  width: 100%;
}

.userContainer {
  align-items: center;
  display: flex;
  cursor: pointer;
  animation: SlideIn 0.5s 1;
  width: 100%;
}

.rightComponent {
  margin-left: auto;
}

.avater {
  justify-self: center;
  align-self: center;
}

.userName {
  margin-left: 8px;
  font-size: 20px;
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