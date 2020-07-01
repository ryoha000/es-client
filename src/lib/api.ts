/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from 'axios';
import { MinimalGame, GameWithoutNum, Campaign } from 'src/types/root';

export const getGamesWithoutNumByIds = async (ids: number[]): Promise<GameWithoutNum[]> => {
  return (await axios.post<GameWithoutNum[]>('/api/games', { ids: ids })).data
}

export const getMinimalGames = async (): Promise<MinimalGame[]> => {
  return (await axios.get<MinimalGame[]>('/api/games')).data
}

export const getGame = async (id: number): Promise<GameWithoutNum> => {
  return (await axios.get<GameWithoutNum>(`/api/games/${id}`)).data
}

export const getCampaigns = async (): Promise<Campaign[]> => {
  return (await axios.get<Campaign[]>('/api/campaigns')).data
}
