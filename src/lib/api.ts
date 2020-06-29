/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from 'axios';
import { DMM, MinimalGame, Game1 } from 'src/types/root';

const getAllDMM = async () => {
  const data = await axios.get<DMM[]>('/api/games')
  return data.data
}
export const getMinimalGames = async (): Promise<MinimalGame[]> => {
  return (await axios.get<MinimalGame[]>('/api/games')).data
}

export const getGame = async (id: number): Promise<Game1> => {
  return (await axios.get<Game1>(`/api/games/${id}`)).data
}
