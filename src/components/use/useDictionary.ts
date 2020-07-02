import { Game } from 'src/types/root';
import { Ref } from '@vue/composition-api';
import useScraping from './useScraping'

const useDictionary = (games: Ref<Record<number, Game>>) => {
  // const addGame = (game: Game) => {
  //   games.value[game.id] = game
  // }
  // const checkDictionary = (id: number) => {
  //   return games.value[id] !== undefined
  // }
  // const setGameOrPass = async (id: number) => {
  //   if (checkDictionary(id)) {
  //     return
  //   }
  //   const { getGameDetail } = useScraping()
  //   games.value[id] = await getGameDetail(id)
  // }
  // const getOrSelect = async (id: number) => {
  //   if (checkDictionary(id)) {
  //     return games.value[id]
  //   }
  //   const { getGameDetail } = useScraping()
  //   const game = await getGameDetail(id)
  //   console.log('get owari')
  //   return game
  // }
  // return { addGame, getOrSelect, setGameOrPass }
}

export default useDictionary