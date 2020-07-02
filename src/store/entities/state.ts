import { MinimalGameMap, GameMap, GameDetailMap } from '.'

export type S = {
  haveGames: GameMap
  minimalGames: MinimalGameMap
  gameDetails: GameDetailMap
}

export const state: S = {
  haveGames: {},
  minimalGames: {},
  gameDetails: {},
}
