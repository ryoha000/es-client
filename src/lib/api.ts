/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from 'axios';
import { MinimalGame, Game, Campaign, GameAndBrand, User } from 'src/types/root';

export const getGamesWithoutNumByIds = async (ids: number[]): Promise<Game[]> => {
  return (await axios.post<Game[]>('/api/games', { ids: ids })).data
}

export const getMinimalGames = async (): Promise<MinimalGame[]> => {
  return (await axios.get<MinimalGame[]>('/api/games')).data
}

export const getGame = async (id: number): Promise<GameAndBrand> => {
  return (await axios.get<GameAndBrand>(`/api/games/${id}`)).data
}

export const getCampaigns = async (): Promise<Campaign[]> => {
  return (await axios.get<Campaign[]>('/api/campaigns')).data
}

export const getSchedules = async (): Promise<Game[]> => {
  return (await axios.get<Game[]>('/api/recentgames')).data
}

export const getMe = async (): Promise<User> => {
  return (await axios.get<User>('/api/me')).data
}

export const login = async (name: string, pass: string): Promise<User> => {
  return (await axios.post<User>('/api/login', { name: name, password: pass })).data
}

export const signup = async (name: string, pass: string): Promise<User> => {
  return (await axios.post<User>('/api/users', { name: name, display_name: name, password: pass })).data
}
