import { MinimalGameMap, GameMap, Undefinedable } from '.'

export type S = {
  games: Undefinedable<GameMap>
  minimalGames: Undefinedable<MinimalGameMap>
}

export const state: S = {
  games: {},
  minimalGames: {},
}
