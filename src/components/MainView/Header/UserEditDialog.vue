<template>
  <q-dialog v-model="isOpen" @before-hide="close" v-if="me !== null">
    <q-card :class="$style.cardContainer" >
      <q-card-section>
        <div class="text-h6" :class="$style.headerTitle">登録情報の編集</div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <div>
            <q-input v-model="me.display_name" label="表示名" />
            <q-input v-model="me.comment" label="一言コメント" type="textarea" />
            <q-input v-model="me.es_user_id" label="批評空間のユーザーID" />
            <q-input v-model="me.twitter_id" label="TwitterID" />
            <q-input v-model="me.icon_url" label="アイコンのURL" />
            <q-checkbox v-model="me.show_all_users" label="(匿名化あり)全体のタイムラインに自分の履歴を流す" />
            <q-checkbox v-model="me.show_detail_all_users" label="(匿名化なし)全体のタイムラインに自分の履歴を流す" />
            <q-checkbox v-model="me.show_followers" label="(抜きゲ―なし)フォロワーのタイムラインに自分の履歴を流す" />
            <q-checkbox v-model="me.show_followers_okazu" label="(抜きゲ―あり)フォロワーのタイムラインに自分の履歴を流す" />
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-btn color="primary" label="更新" @click="update"/>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import store from 'src/store'

export default defineComponent({
  name: 'UserEditDialog',
  props: {
    isOpen: {
      type: Boolean, required: true
    },
  },
  setup(_, context) {
    const close = () => {
      context.emit('close')
    }
    const update = async () => {
      await store.dispatch.domain.updateMe(me.value)
      close()
    }
    const me = ref(Object.assign({}, store.state.domain.me))
    return { close, me, update }
  }
});
</script>

<style lang="scss" module>
.cardContainer {
  padding: 8px;
  max-width: 80%;
}
</style>
