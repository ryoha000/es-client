import { MinimalGameMap, GameMap, GameDetailMap, ListMap } from '.'

export type S = {
  haveGames: GameMap
  minimalGames: MinimalGameMap
  gameDetails: GameDetailMap
  listInServerGames: ListMap
}

export const state: S = {
  haveGames: {},
  minimalGames: {},
  gameDetails: {},
  listInServerGames: {}
}
