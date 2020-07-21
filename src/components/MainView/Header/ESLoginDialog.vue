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
          <q-input v-model="loginName" label="ログインID" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input v-model="loginPW" type="password" label="パスワード" />
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
          <q-btn color="primary" :label="isLogin ? 'ログイン' : 'ユーザー登録'" @click="loginOrSignup"/>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
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
    const loginOrSignup = async () => {
      if (props.isLogin) {
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
    }
    return { close, loginName, loginPW, loginOrSignup }
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
