import { MinimalGameMap, GameWithoutNumMap, Undefinedable } from '.'

export type S = {
  haveGames: GameWithoutNumMap
  minimalGames: MinimalGameMap
}

export const state: S = {
  haveGames: {},
  minimalGames: {},
}
