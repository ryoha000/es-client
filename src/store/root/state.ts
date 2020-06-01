import { StackType, Game, Creator, Seiyu, Record } from '../../types/root'

export interface RootStateInterface {
  routeIndex: number
  routeStack: StackType[]
  games: Record<number, Game>
  creators: Record<number, Creator>
  seiyus: Record<number, Seiyu>
}

const state: RootStateInterface = {
  routeIndex: 0,
  routeStack: [{ type: 'Home', id: 0 }],
  games: {},
  creators: {},
  seiyus: {}
};

export default state;
