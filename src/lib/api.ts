/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from 'axios';
import { MinimalGame, Game, Campaign, GameAndBrand, User, MaskedTimeline, Review, FollowWithUser, UserDetail } from 'src/types/root';

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

export const updateMe = async (user: User): Promise<User> => {
  return (await axios.put<User>('/api/users', { user: user })).data
}

export const login = async (name: string, pass: string): Promise<User> => {
  return (await axios.post<User>('/api/login', { name: name, password: pass })).data
}

export const signup = async (name: string, pass: string): Promise<User> => {
  return (await axios.post<User>('/api/users', { name: name, display_name: name, password: pass })).data
}

export const getMaskedTimeline = async (id: string): Promise<MaskedTimeline> => {
  return (await axios.get<MaskedTimeline>(`/api/timelines/${id}`)).data
}

export const getReviews = async (): Promise<Review[]> => {
  return (await axios.get<Review[]>('/api/reviews')).data
}

export const postFollowRequest = async (id: string): Promise<void> => {
  await axios.post(`/api/users/${id}/follows`)
}

export const getFollowRequestsToMe = async (): Promise<FollowWithUser[]> => {
  return (await axios.get<FollowWithUser[]>('/api/follows')).data
}

export const getFollowRequestsFromMe = async (): Promise<FollowWithUser[]> => {
  return (await axios.get<FollowWithUser[]>('/api/me/follows')).data
}

export const responseFollowRequest = async (id: string, approve: boolean): Promise<void> => {
  await axios.post(`/api/follows/${id}`, { approve: approve })
}

export const getFollowers = async (id: string): Promise<User[]> => {
  return (await axios.get<User[]>(`/api/users/${id}/followers`)).data
}

export const getFollowees = async (id: string): Promise<User[]> => {
  return (await axios.get<User[]>(`/api/users/${id}/followees`)).data
}

export const getUser = async (id: string): Promise<UserDetail> => {
  return (await axios.get<UserDetail>(`/api/users/${id}`)).data
}
