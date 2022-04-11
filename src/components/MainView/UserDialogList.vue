<template>
  <div v-if="errorText">{{ errorText }}</div>
  <div v-else-if="isLoadingList">now loading...</div>
  <div v-else>
    <user-dialog-list-content
      :list="list"
      v-for="(list, i) in lists"
      :key="i"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import { ListInServer } from '../../types/root';
import GameCard from 'src/components/MainView/GameCard.vue';
import { getListInServerByUserId } from '../../lib/api';
import UserDialogListContent from './UserDialogListContent.vue';

export default defineComponent({
  name: 'UserDialogList',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  components: { GameCard, UserDialogListContent },
  setup(props) {
    const lists = ref<ListInServer[]>([]);

    const isLoadingList = ref(true);

    const errorText = ref('');

    onMounted(async () => {
      isLoadingList.value = true;
      try {
        lists.value = await getListInServerByUserId(props.userId);
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        // @ts-ignore
        if (e.response.status === 401) {
          errorText.value = 'ログインしてください';
        }
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        switch (e.response.data) {
          case 'you are not follow this user':
            errorText.value = 'このユーザーをフォローしていません';
            break;
          case 'This user does not disclose information to their followers':
            errorText.value = 'このユーザーは非公開設定にしています';
        }
      }
      isLoadingList.value = false;
    });
    return { lists, isLoadingList, errorText };
  }
});
</script>
