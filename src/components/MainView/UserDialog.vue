<template>
  <q-dialog v-model="isOpen" @before-hide="close">
    <div v-if="isLoading">now loading</div>
    <q-card v-else :class="$style.cardContainer">
      <q-card-section>
        <div :class="$style.headerContainer">
          <!-- <q-img :src="userIcon" :class="$style.avater" /> -->
          <img :src="userIcon" :class="$style.avater" />
          <div :class="$style.detailContainer">
            <div :class="$style.userNameContainer">
              <div class="text-h6">{{ userDetail.user.display_name }}</div>
              <q-btn
                :disable="waiting"
                v-if="me && me.name !== userDetail.user.name"
                rounded
                icon-right="send"
                color="primary"
                outline
                label="フォローリクエストを送る"
                :class="$style.followButton"
                @click="sendFollowRequest"
              />
            </div>
            <div :class="$style.snsRootContainer">
              <div :class="$style.snsContainer">
                <q-img
                  src="../../statics/icons/es_favicon.png"
                  width="16px"
                  contain
                />
                <div :class="$style.snsText" @click="openES">
                  {{ userDetail.user.es_user_id }}
                </div>
              </div>
              <div :class="$style.snsContainer">
                <q-img
                  src="../../statics/icons/twitter.png"
                  width="16px"
                  contain
                />
                <div :class="$style.snsText" @click="openTwitter">
                  {{
                    userDetail.user.twitter_id
                      ? userDetail.user.twitter_id
                      : '未設定'
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <q-tabs v-model="tab" narrow-indicator dense align="justify">
            <q-tab class="text-blue" name="activity" icon="home" />
            <q-tab class="text-blue" name="lists" icon="folder" />
          </q-tabs>
        </q-item-section>
      </q-item>
      <q-item style="height: calc( 100% - 178px )">
        <q-item-section>
          <q-scroll-area :class="$style.scrollArea">
            <user-dialog-activity
              v-if="tab === 'activity'"
              :userDetail="userDetail"
            />
            <user-dialog-list
              v-if="tab === 'lists'"
              :userId="userDetail.user.id"
            />
          </q-scroll-area>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed
} from '@vue/composition-api';
import { UserDetail } from '../../types/root';
import { getUser, postFollowRequest } from 'src/lib/api';
import UserDialogActivity from './UserDialogActivity.vue';
import UserDialogList from './UserDialogList.vue'
import store from 'src/store';
import electron, { remote } from 'electron';
import DefaultIcon from 'src/statics/icons/user_pict.png'

export default defineComponent({
  name: 'UserDialog',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  components: {
    UserDialogActivity,
    UserDialogList
  },
  setup(props, context) {
    const close = () => {
      context.emit('close');
    };

    const userDetail = ref<UserDetail | null>(null);
    const isLoading = ref(true);

    const me = computed(() => store.state.domain.me);

    const userIcon = computed(() => {
      if (userDetail.value?.user.icon_url === '') {
        return DefaultIcon
      }
      return userDetail.value?.user.icon_url ?? DefaultIcon
    })
    const waiting = ref(false);
    const sendFollowRequest = async () => {
      waiting.value = true;
      try {
        await postFollowRequest(props.id);
        await electron.remote.dialog.showMessageBox({
          message: 'リクエストを送りました'
        });
      } catch (e) {
        electron.remote.dialog.showErrorBox(
          'error',
          '既にフォローリクエストを送っています'
        );
      }
    };
    const tab = ref('activity');
    onMounted(async () => {
      isLoading.value = true;
      userDetail.value = await getUser(props.id);
      isLoading.value = false;
    });
    const openTwitter = async () => {
      if (userDetail.value?.user.twitter_id) {
        try {
          await remote.shell.openExternal(`https://twitter.com/${userDetail.value.user.twitter_id}`)
        } catch (e) {
          await remote.dialog.showMessageBox({ message: 'ブラウザで開くのに失敗しました。WindowsのTwitterをアンインストールすれば直ります。'})
        }
      }
    }
    const openES = async () => {
      if (userDetail.value?.user.es_user_id && userDetail.value?.user.es_user_id !== '内緒') {
        await remote.shell.openExternal(`https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/user_infomation.php?user=${userDetail.value.user.es_user_id}`)
      }
    }
    return {
      userIcon,
      close,
      userDetail,
      isLoading,
      tab,
      me,
      sendFollowRequest,
      waiting,
      openTwitter,
      openES,
    };
  }
});
</script>

<style lang="scss" module>
.cardContainer {
  padding: 8px;
  width: 80%;
  max-width: 100% !important;
  height: calc(100vh - 48px);
  background: rgb(252, 249, 249);
}

.headerContainer {
  display: flex;
}

.userNameContainer {
  display: flex;
}

.followButton {
  margin-left: auto;
  margin-right: 16px;
}

.avater {
  width: 96px;
}

.snsContainer {
  display: flex;
  width: 45%;
  margin-right: 8px;
  cursor: pointer;
}

.snsRootContainer {
  display: flex;
  width: 100%;
  margin-top: auto;
}

.detailContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.snsText {
  margin-left: 8px;
  font-size: 0.95rem;
}

.scrollArea {
  height: 100%;
  width: 100%;
}
</style>
