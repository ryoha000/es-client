<template>
  <q-expansion-item
    expand-separator
    :class="$style.expansionContainer"
    @show="showGames"
  >
    <template v-slot:header>
      <q-item-section>
        {{ list.name }}
      </q-item-section>
      <q-item-section side>
        <div class="row items-center">
          <q-icon :name="listIcon" dark size="24px" @click.stop="openURL" />
        </div>
      </q-item-section>
    </template>
    <div :class="$style.gameCards" v-if="!isLoadingGames">
      <game-card
        :cardInfo="createCardInfo(game)"
        :class="$style.gameCard"
        v-for="(game, i) in games"
        :key="i"
      />
    </div>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from '@vue/composition-api';
import { Game, ListInServer } from '../../types/root';
import { remote } from 'electron';
import UserDialogActivityItem from './UserDialogActivityItem.vue';
import GameCard from 'src/components/MainView/GameCard.vue';
import { getListInServer } from '../../lib/api';
import { CardInfo } from './HorizontalScroll.vue';

export default defineComponent({
  name: 'UserDialogListContent',
  props: {
    list: {
      type: Object as PropType<ListInServer>,
      required: true
    }
  },
  components: { UserDialogActivityItem, GameCard },
  setup(props) {
    const createCardInfo = (game: Game): CardInfo => {
      return {
        title: game.gamename ?? '',
        supplement: null,
        image: `https://pics.dmm.co.jp/${game.dmm_genre ?? ''}/pcgame/${game.dmm ?? ''}/${game.dmm ?? ''}pl.jpg`,
        // image: '',
        url: `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${game.id}`,
        contain: true
      };
    };

    const games = ref<Game[]>([]);

    const isLoadingGames = ref(true);

    const showGames = async () => {
      isLoadingGames.value = true;
      games.value = (await getListInServer(props.list.id)).games;
      isLoadingGames.value = false;
    };
    const listIcon = computed(() =>
      props.list.url?.includes('wishlist')
        ? 'card_giftcard'
        : props.list.url
        ? 'link'
        : 'link_off'
    );
    const openURL = async () => {
      if (props.list.url) {
        await remote.shell.openExternal(props.list.url);
      }
    };
    return {
      games,
      isLoadingGames,
      showGames,
      createCardInfo,
      listIcon,
      openURL
    };
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
