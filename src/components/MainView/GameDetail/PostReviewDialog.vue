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
          <div class="text-h6" :class="$style.headerTitle">ErogameScapeにレビューを投稿</div>
        </div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <a href="" @click.prevent="toDetail">詳細な投稿はこちらから</a>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input v-model.number="tokuten" label="得点" />
          <q-checkbox dense v-model="possession" label="所持" />
          <q-checkbox dense v-model="play" label="プレイ済み" />
          <q-checkbox dense v-model="giveup" label="放棄" />
          <q-input v-model.number="totalPlayTime" label="総プレイ時間" />
          <q-input v-model.number="timeBeforeUnderstandingFun" label="面白さが分かるまでのプレイ時間" />
          <q-select v-model="okazuLabel" :options="okazuOption" label="おかずに使えた？" />
          <q-input v-model="hitokoto" label="一言感想" />
          <q-input v-model="memo" type="textarea" label="長文感想" />
          <q-checkbox dense v-model="netabare" label="ネタバレ？" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-btn color="primary" label="レビューを投稿" @click="review"/>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { ipcRenderer, remote } from 'electron';
import useReviewForm from './use/useReviewForm'

export default defineComponent({
  name: 'LoginDialog',
  props: {
    isOpen: {
      type: Boolean, required: true
    },
    id: {
      type: Number, required: true
    }
  },
  setup(props, context) {
    const close = () => {
      context.emit('close')
    }
    const toDetail = async () => {
      await remote.shell.openExternal(`https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/contents_game.php?game_id=${props.id}`)
    }

    const tokuten = ref(0)
    const possession = ref(false)
    const play = ref(false)
    const giveup = ref(false)
    const totalPlayTime = ref(0)
    const timeBeforeUnderstandingFun = ref(0)
    const okazu = ref(-999)
    const okazuLabel = ref('-')
    const okazuOption: { label: string, value: number }[] = [
      { label: '-', value: -999 },
      { label: 'とても使えた', value: 4 },
      { label: 'かなり使えた', value: 3 },
      { label: 'だいぶ使えた', value: 2 },
      { label: 'それなりに使えた', value: 1 },
      { label: 'あまり使えなかった', value: -1 },
      { label: 'まったく使えなかった', value: -2 },
      { label: 'そもそも趣向が合わなかった', value: -998 },
    ]
    const hitokoto = ref('')
    const memo = ref('')
    const netabare = ref(true)

    const review = async () => {
      const { setupForm } = useReviewForm()
      if ((await remote.session.defaultSession.cookies.get({ url: 'https://erogamescape.dyndns.org' })).length < 3) {
        remote.dialog.showErrorBox('未ログイン', '右上から批評空間にログインしてください');
        close()
        return
      }
      okazu.value = okazuOption.find(v => v.label === okazuLabel.value)?.value ?? -999
      ipcRenderer.send('es-review', { id: props.id, reviewForm: setupForm<string | number | boolean>(
        { key: 'data[tokuten]', value: tokuten },
        { key: 'data[possession]', value: possession },
        { key: 'data[play]', value: play },
        { key: 'data[giveup]', value: giveup },
        { key: 'data[total_play_time]', value: totalPlayTime },
        { key: 'data[time_before_understanding_fun]', value: timeBeforeUnderstandingFun },
        { key: 'data[okazu]', value: okazu },
        { key: 'data[hitokoto]', value: hitokoto },
        { key: 'data[memo]', value: memo },
        { key: 'data[natabare]', value: netabare }
      )})
      ipcRenderer.on('es-review-reply', () => {
        close()
      })
    }
    return {
      close,
      toDetail,
      tokuten,
      possession,
      play,
      giveup,
      totalPlayTime,
      timeBeforeUnderstandingFun,
      okazu,
      okazuLabel,
      okazuOption,
      hitokoto,
      memo,
      netabare,
      review,
    }
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
</style>
