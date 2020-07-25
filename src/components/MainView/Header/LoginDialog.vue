<template>
  <q-dialog v-model="isOpen" @before-hide="close" >
    <q-card style="width: 390px" :class="$style.cardContainer" >
      <q-card-section>
        <div class="text-h6" :class="$style.headerTitle">{{ cardHeader }}</div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <q-input v-model="loginName" label="名前" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input v-model="loginPW" type="password" label="パスワード" @keypress="pressEnter" />
        </q-item-section>
      </q-item>
        <div :class="$style.toggleContainer">
          <q-btn flat color="primary" label="ログイン" @click="toggleIsLogin(true)"/>
          <q-btn flat color="primary" label="ユーザー登録" @click="toggleIsLogin(false)"/>
        </div>
      <q-item>
        <q-item-section>
          <q-btn color="primary" :label="cardHeader" :disable="isLoading" @click="loginOrSignup"/>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from '@vue/composition-api';
import LinkC from 'src/components/MainView/GameDetail/Link.vue'
import store from 'src/store'
import { remote } from 'electron';

export default defineComponent({
  name: 'LoginDialog',
  props: {
    isOpen: {
      type: Boolean, required: true
    },
    isLogin: {
      type: Boolean, required: true
    },
  },
  components: {
    LinkC,
  },
  setup(props, context) {
    const close = () => {
      loginName.value = ''
      loginPW.value = ''
      context.emit('close')
    }
    const loginName = ref('')
    const loginPW = ref('')
    const isLogin = ref(true)
    const cardHeader = computed(() => isLogin.value ? 'ログイン' : 'ユーザー登録')
    const isLoading = ref(false)
    const toggleIsLogin = (islog: boolean) => {
      isLogin.value = islog
    }
    onMounted(() => {
      isLogin.value = props.isLogin
    })
    const loginOrSignup = async () => {
      isLoading.value = true
      if (isLogin.value) {
        try {
          await store.dispatch.domain.login({ name: loginName.value, password: loginPW.value })
          close()
        } catch (e) {
          remote.dialog.showErrorBox('名前とパスワードの組が間違っています', '確認してください')
        }
      } else {
        try {
          await store.dispatch.domain.signup({ id: loginName.value, pw: loginPW.value })
          close()
        } catch (e) {
          remote.dialog.showErrorBox('既に使われている名前です', '違う名前にしてください')
        }
      }
      isLoading.value = false
    }
    const pressEnter = async (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        await loginOrSignup()
      }
    }
    return { close, loginName, loginPW, loginOrSignup, toggleIsLogin, cardHeader, pressEnter, isLoading }
  }
});
</script>

<style lang="scss" module>
.cardContainer {
  padding: 8px;
  height: 70%;
  display: flex;
  flex-direction: column;
}
.headerContainer {
  display: flex;
}
.headerTitle {
  margin-left: 8px;
}
.toggleContainer {
  margin-top: auto;
  margin-bottom: 8px;
  padding: 0 16px;
  display: flex;
  justify-content: center;
}
</style>
