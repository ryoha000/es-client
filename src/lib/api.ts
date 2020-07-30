/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from 'axios';
import { MinimalGame, Game, Campaign, GameAndBrand, User, MaskedTimeline, Review, FollowWithUser, UserDetail, ListInServerWithGames, ListInServer, PostListStruct, RecentGame } from 'src/types/root';

axios.defaults.baseURL = 'http://localhost:8088'

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

export const getSchedules = async (): Promise<RecentGame[]> => {
  return (await axios.get<RecentGame[]>('/api/recentgames')).data
}

export const getMe = async (): Promise<User> => {
  return (await axios.get<User>('/api/me')).data
}

export const logout = async ():Promise<void> => {
  await axios.post('/api/logout')
}

export const updateMe = async (user: User): Promise<User> => {
  return (await axios.put<User>('/api/users', { user: user })).data
}

export const postUser = async (name: string, pass: string, isLogin: boolean): Promise<User> => {
  return (await axios.post<User>('/api/users', { name: name, password: pass, is_login: isLogin })).data
}

export const getMaskedTimelines = async (offset: number): Promise<MaskedTimeline[]> => {
  return (await axios.get<MaskedTimeline[]>(`/api/timelines?offset=${offset}`)).data
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

export const getMyListInServers = async (): Promise<ListInServer[]> => {
  return (await axios.get<ListInServer[]>('/api/lists')).data
}

export const postListInServer = async (payload: { name: string, comment: string, priority: number, url: string | null, isPublic: boolean }): Promise<ListInServer> => {
  return (await axios.post<ListInServer>('/api/lists', {
    name: payload.name,
    comment: payload.comment,
    priority: payload.priority,
    url: payload.url,
    is_public: payload.isPublic,
  })).data
}

export const getListInServer = async (id: string): Promise<ListInServerWithGames> => {
  return (await axios.get<ListInServerWithGames>(`/api/lists/${id}`)).data
}

export const putListInServer = async (id: string, payload: PostListStruct): Promise<void> => {
  await axios.put(`/api/lists/${id}`, { name: payload.name, comment: payload.comment, priority: payload.priority, url: payload.url, is_public: payload.isPublic })
}

export const addGameToListInServer = async (id: string, gameIds: number[] ): Promise<void> => {
  await axios.post(`/api/lists/${id}`, { game_ids: gameIds })
}

export const deleteGameFromListInServer = async (id: string, gameIds: number[]): Promise<void> => {
  await axios.patch(`/api/lists/${id}`, { game_ids: gameIds })
}

export const deleteListInServer = async (id: string): Promise<void> => {
  await axios.delete(`/api/lists/${id}`)
}

export const playGame = async (gameId: number): Promise<void> => {
  await axios.post(`/api/play/${gameId}`)
}

export const getListInServerByUserId = async (userId: string): Promise<ListInServer[]> => {
  return (await axios.get<ListInServer[]>(`/api/users/${userId}/lists`)).data
}
