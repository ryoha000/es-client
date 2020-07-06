<template>
  <div>
    <div @click="click">
      <q-avatar size="32px" :class="$style.avater" >
        <img :src="userIcon">
      </q-avatar>
    </div>
    <login-dialog :isOpen="isOpenLoginDialog" @close="closeLoginDialog" :isLogin="isLogin" />
    <user-edit-dialog :isOpen="isOpenUserEditDialog" @close="closeUserEditDialog" v-if="isOpenUserEditDialog" />
    <follow-dialog :isOpen="isOpenFollowDialog" @close="closeFollowDialog" v-if="isOpenFollowDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import { remote } from 'electron'
import store from 'src/store'
import LoginDialog from './LoginDialog.vue'
import UserEditDialog from './UserEditDialog.vue'
import FollowDialog from './FollowDialog.vue'

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export default defineComponent({
  name: 'UserIcon',
  components: { LoginDialog, UserEditDialog, FollowDialog },
  setup() {
    const isOpenLoginDialog = ref(false)
    const openLoginDialog = (isLog: boolean) => {
      isLogin.value = isLog
      isOpenLoginDialog.value = true
    }
    const closeLoginDialog = () => {
      isOpenLoginDialog.value = false
    }
    const isLogin = ref(true)

    const isOpenUserEditDialog = ref(false)
    const openUserEditDialog = () => {
      isOpenUserEditDialog.value = true
    }
    const closeUserEditDialog = () => {
      isOpenUserEditDialog.value = false
    }

    const isOpenFollowDialog = ref(false)
    const openFollowDialog = () => {
      isOpenFollowDialog.value = true
    }
    const closeFollowDialog = () => {
      isOpenFollowDialog.value = false
    }
    
    const userIcon = computed(() => {
      const me = store.state.domain.me
      if (store.state.domain.me && me?.icon_url) {
        return me.icon_url
      }
      return '../../../statics/icons/user-pict.png'
    })

    const click = () => {
      const menu = new Menu()

      menu.append(new MenuItem({ label: 'ログイン' , click: () => { openLoginDialog(true) }  }))
      menu.append(new MenuItem({ type: 'separator' }));
      
      menu.append(new MenuItem({ label: 'ユーザー登録', click: () => { openLoginDialog(false) }  }))

      if (store.state.domain.me) {
        menu.append(new MenuItem({ type: 'separator' }));
        menu.append(new MenuItem({ label: '編集', click: () => { openUserEditDialog() }  }))

        menu.append(new MenuItem({ type: 'separator' }));
        menu.append(new MenuItem({ label: 'フォロー', click: () => { openFollowDialog() }  }))

        const menuItems = ['メッセージ']
        for (const item of menuItems) {
          menu.append(new MenuItem({ type: 'separator' }));
          menu.append(new MenuItem({ label: `${item}` , click: () => { openLoginDialog(true) }  }))
        }
      }
      menu.popup()
    }
    return {
      userIcon,
      click,
      isOpenLoginDialog,
      closeLoginDialog,
      isLogin,
      isOpenUserEditDialog,
      closeUserEditDialog,
      isOpenFollowDialog,
      closeFollowDialog,
    }
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
