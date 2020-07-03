<template>
  <div>
    <div @click="click">
      <q-avatar size="32px" :class="$style.avater" >
        <img :src="userIcon">
      </q-avatar>
    </div>
    <login-dialog :isOpen="isOpenLoginDialog" @close="closeLoginDialog" :isLogin="isLogin" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import { remote } from 'electron'
import store from 'src/store'
import LoginDialog from './LoginDialog.vue'

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export default defineComponent({
  name: 'UserIcon',
  components: {
    LoginDialog
  },
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
      menu.append(new MenuItem({ type: 'separator' }));

      const menuItems = ['編集', 'フォロー', 'メッセージ']
      for (const item of menuItems) {
        menu.append(new MenuItem({ label: `${item}` , click: () => { openLoginDialog(true) }  }))
        menu.append(new MenuItem({ type: 'separator' }));
      }
      menu.popup()
    }
    return { userIcon, click, isOpenLoginDialog, closeLoginDialog, isLogin }
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
