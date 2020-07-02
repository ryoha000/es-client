import { Seiya } from '.'
import { List, StackType } from 'src/types/root'

export type S = {
  seiya: Seiya
  lists: List[]
  routeIndex: number
  routeStack: StackType[]
}

export const state: S = {
  seiya: [],
  lists: [],
  routeIndex: 0,
  routeStack: [{ type: 'Home', id: 0 }],
}
