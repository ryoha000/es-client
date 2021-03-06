import { Seiya } from '.'
import { List, StackType } from 'src/types/root'

export type S = {
  seiya: Seiya
  lists: List[]
  lastGameAccessTime: Record<number, Date>
  routeIndex: number
  routeStack: StackType[]
  tooltipPoint: { x: number, y: number }
}

export const state: S = {
  seiya: [],
  lists: [],
  lastGameAccessTime: {},
  routeIndex: 0,
  routeStack: [{ type: 'Home', id: 0 }],
  tooltipPoint: { x: 0, y: 0 }
}
