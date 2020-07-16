<template>
  <div v-if="errorText">{{ errorText }}</div>
  <div v-else-if="isLoadingList">now loading...</div>
  <div v-else :class="$style.container">
    <q-expansion-item
      v-for="(list, i) in lists" :key="i"
      expand-separator
      :class="$style.expansionContainer"
      :label="list.name"
      @show="showGames(i)"
    >
      <div :class="$style.gameCards" v-if="isLoadingGames[i] === false" >
        <game-card :cardInfo="createCardInfo(game)" :class="$style.gameCard" v-for="(game, j) in games[list.id]" :key="j"/>
      </div>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import { Game, ListInServer } from '../../types/root';
import UserDialogActivityItem from './UserDialogActivityItem.vue'
import GameCard from 'src/components/MainView/GameCard.vue'
import { getListInServerByUserId, getListInServer } from '../../lib/api';

export default defineComponent({
  name: 'UserDialogList',
  props: {
    userId: {
      type: String , required: true,
    }
  },
  components: { UserDialogActivityItem, GameCard },
  setup(props) {
    const createCardInfo = (game: Game) => {
      return {
        title: game.gamename,
        supplement: 'game.brandName',
        // image: `https://pics.dmm.co.jp/${game.dmm_genre ?? ''}/pcgame/${game.dmm ?? ''}/${game.dmm ?? ''}pl.jpg`,
        image: '',
        url: `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${game.id}`,
        contain: true
      }
    }

    const lists = ref<ListInServer[]>([])
    const games = ref<Record<string, Game[]>>({})

    const isLoadingList = ref(true)
    const isLoadingGames = ref<boolean[]>([])

    const errorText = ref('')

    const showGames = async (i: number) => {
      if (games.value[lists.value[i].id]) {
        return
      }
      console.log('start')
      isLoadingGames.value[i] = true
      try {
        Object.assign(games.value, { [lists.value[i].id]: (await getListInServer(lists.value[i].id)).games })
      } catch {

      }
      isLoadingGames.value[i] = false
      console.log('end')
    }

    onMounted(async () => {
      isLoadingList.value = true
      try {
        lists.value = await getListInServerByUserId(props.userId)
        isLoadingGames.value = lists.value.map(() => true)
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (e.response.status === 401) {
          errorText.value = 'ログインしてください'
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        switch (e.response.data) {
          case 'you are not follow this user':
            errorText.value = 'このユーザーをフォローしていません'
            break
          case 'This user does not disclose information to their followers':
            errorText.value = 'このユーザーは非公開設定にしています'
        }
      }
      isLoadingList.value = false
    })
    return { lists, games, isLoadingList, isLoadingGames, showGames, errorText, createCardInfo }
  }
});
</script>

<style lang="scss" module>
.expansionContainer {
  width: 100%;
  font-size: 20px;
}

.gameCards {
  display: flex;
  flex-wrap: wrap;
  padding-left: 16px;
}

.gameCard {
  margin-right: 16px;
  margin-top: 16px;
}
</style>

