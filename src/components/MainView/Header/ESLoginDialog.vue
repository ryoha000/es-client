<template>
  <q-dialog v-model="isOpen" @before-hide="close" >
    <q-card style="width: 390px" :class="$style.cardContainer" >
      <q-card-section>
        <div :class="$style.headerContainer">
          <q-img
              style="width: 32px"
              :ratio="1"
              class="rounded-borders"
              src="../../../statics/icons/es_favicon.png"
            />
          <div class="text-h6" :class="$style.headerTitle">ErogameScape</div>
        </div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <q-input v-model="loginId" label="ログインID" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input v-model="loginPW" type="password" @keypress="pressEnter" label="パスワード" />
        </q-item-section>
      </q-item>
      <div :class="$style.linkContainer">
        <link-c
          title="批評空間のアカウントを持ってない人はこちら"
          url="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/regForm.php"
          :icon="false"
          :fontSize="16"
        />
      </div>
      <q-item>
        <q-item-section>
          <q-btn color="primary" label="ログイン" :disable="isLoading" @click="login"/>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import LinkC from 'src/components/MainView/GameDetail/Link.vue'
import { ipcRenderer, remote } from 'electron';

export default defineComponent({
  name: 'LoginDialog',
  props: {
    isOpen: {
      type: Boolean, required: true
    },
  },
  components: {
    LinkC,
  },
  setup(props, context) {
    const close = () => {
      loginId.value = ''
      loginPW.value = ''
      context.emit('close')
    }
    const loginId = ref('')
    const loginPW = ref('')
    const isLoading = ref(false)
    const login = () => {
      isLoading.value = true
      ipcRenderer.send('es-login', { id: loginId.value, password: loginPW.value})
      ipcRenderer.on('es-login-reply', () => {
        remote.session.defaultSession.cookies.get({ url: 'https://erogamescape.dyndns.org' })
          .then((cookies) => {
            isLoading.value = false
            if (cookies.length < 3) {
              remote.dialog.showErrorBox(
                'error',
                'ログインIDかパスワードが違います'
              );
              return
            }
            close()
          }).catch((error) => {
            isLoading.value = false
            console.log(error)
          })
      })
    }
    const pressEnter = (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        login()
      }
    }
    return { close, loginId, loginPW, login, pressEnter, isLoading }
  }
});
</script>

<style lang="scss" module>
.cardContainer {
  padding: 8px;
}
.headerContainer {
  display: flex;
}
.headerTitle {
  margin-left: 8px;
}
.linkContainer {
  margin-top: 40px;
  margin-bottom: 8px;
  padding: 0 16px;
}
</style>
