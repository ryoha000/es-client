import { Seiya } from '.'
import { List } from 'src/types/root'

export type S = {
  seiya: Seiya
  lists: List[]
}

export const state: S = {
  seiya: [],
  lists: [],
}
