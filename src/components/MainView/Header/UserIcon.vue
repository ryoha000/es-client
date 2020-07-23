<template>
  <div>
    <div @click="click">
      <q-avatar size="32px" :class="$style.avater">
        <img :src="meIcon" />
      </q-avatar>
    </div>
    <login-dialog
      :isOpen="isOpenLoginDialog"
      @close="closeLoginDialog"
      :isLogin="isLogin"
      v-if="isOpenLoginDialog"
    />
    <e-s-login-dialog
      :isOpen="isOpenESLoginDialog"
      @close="closeESLoginDialog"
      v-if="isOpenESLoginDialog"
    />
    <user-edit-dialog
      :isOpen="isOpenUserEditDialog"
      @close="closeUserEditDialog"
      v-if="isOpenUserEditDialog"
    />
    <follow-dialog
      :isOpen="isOpenFollowDialog"
      @close="closeFollowDialog"
      v-if="isOpenFollowDialog"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import store from 'src/store';
import useIconDialog from './use/useIconDialog'
import LoginDialog from './LoginDialog.vue';
import ESLoginDialog from './ESLoginDialog.vue'
import UserEditDialog from './UserEditDialog.vue';
import FollowDialog from './FollowDialog.vue';
import DefaultIcon from 'src/statics/icons/user_pict.png';

export default defineComponent({
  name: 'UserIcon',
  components: { LoginDialog, ESLoginDialog, UserEditDialog, FollowDialog },
  setup() {
    const isOpenLoginDialog = ref(false);
    const openLoginDialog = (isLog: boolean) => {
      isLogin.value = isLog;
      isOpenLoginDialog.value = true;
    };
    const closeLoginDialog = () => {
      isOpenLoginDialog.value = false;
    };
    const isLogin = ref(true);

    const isOpenUserEditDialog = ref(false);
    const openUserEditDialog = () => {
      isOpenUserEditDialog.value = true;
    };
    const closeUserEditDialog = () => {
      isOpenUserEditDialog.value = false;
    };

    const isOpenFollowDialog = ref(false);
    const openFollowDialog = () => {
      isOpenFollowDialog.value = true;
    };
    const closeFollowDialog = () => {
      isOpenFollowDialog.value = false;
    };

    const isOpenESLoginDialog = ref(false);
    const openESLoginDialog = () => {
      isOpenESLoginDialog.value = true;
    };
    const closeESLoginDialog = () => {
      isOpenESLoginDialog.value = false;
    };

    const me = computed(() => store.state.domain.me)
    const meIcon = computed(() => {
      if (me.value?.icon_url) {
        return me.value.icon_url
      }
      return DefaultIcon
    })

    const click = () => {
      const { setupMenuList } = useIconDialog()
      const menu = setupMenuList(
        openLoginDialog,
        openUserEditDialog,
        openFollowDialog,
        openESLoginDialog,
        me
      );
      menu.popup();
    };
    return {
      meIcon,
      click,
      isOpenLoginDialog,
      closeLoginDialog,
      isLogin,
      isOpenUserEditDialog,
      closeUserEditDialog,
      isOpenFollowDialog,
      closeFollowDialog,
      isOpenESLoginDialog,
      closeESLoginDialog,
    };
  }
});
</script>

<style lang="scss" module>
.avater {
  justify-self: center;
  align-self: center;
  margin-left: 8px;
  cursor: pointer;
}
</style>
