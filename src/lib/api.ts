/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from 'axios';
import { MinimalGame, Game, Campaign, GameAndBrand, User, MaskedTimeline, Review, FollowWithUser, UserDetail, ListInServerWithGames, ListInServer, PostListStruct } from 'src/types/root';

// axios.defaults.baseURL = 'http://localhost:8088'

export const getGamesWithoutNumByIds = async (ids: number[]): Promise<Game[]> => {
  return (await axios.post<Game[]>('http://localhost:8088/api/games', { ids: ids })).data
}

export const getMinimalGames = async (): Promise<MinimalGame[]> => {
  return (await axios.get<MinimalGame[]>('http://localhost:8088/api/games')).data
}

export const getGame = async (id: number): Promise<GameAndBrand> => {
  return (await axios.get<GameAndBrand>(`http://localhost:8088/api/games/${id}`)).data
}

export const getCampaigns = async (): Promise<Campaign[]> => {
  return (await axios.get<Campaign[]>('http://localhost:8088/api/campaigns')).data
}

export const getSchedules = async (): Promise<Game[]> => {
  return (await axios.get<Game[]>('http://localhost:8088/api/recentgames')).data
}

export const getMe = async (): Promise<User> => {
  return (await axios.get<User>('http://localhost:8088/api/me')).data
}

export const updateMe = async (user: User): Promise<User> => {
  return (await axios.put<User>('http://localhost:8088/api/users', { user: user })).data
}

export const login = async (header: string): Promise<User> => {
  return (await axios.post<User>('http://localhost:8088/api/login', { header: header })).data
}

export const signup = async (name: string, pass: string): Promise<User> => {
  return (await axios.post<User>('http://localhost:8088/api/users', { name: name, display_name: name, password: pass })).data
}

export const getMaskedTimelines = async (offset: number): Promise<MaskedTimeline[]> => {
  return (await axios.get<MaskedTimeline[]>(`http://localhost:8088/api/timelines?offset=${offset}`)).data
}

export const getMaskedTimeline = async (id: string): Promise<MaskedTimeline> => {
  return (await axios.get<MaskedTimeline>(`http://localhost:8088/api/timelines/${id}`)).data
}

export const getReviews = async (): Promise<Review[]> => {
  return (await axios.get<Review[]>('http://localhost:8088/api/reviews')).data
}

export const postFollowRequest = async (id: string): Promise<void> => {
  await axios.post(`http://localhost:8088/api/users/${id}/follows`)
}

export const getFollowRequestsToMe = async (): Promise<FollowWithUser[]> => {
  return (await axios.get<FollowWithUser[]>('http://localhost:8088/api/follows')).data
}

export const getFollowRequestsFromMe = async (): Promise<FollowWithUser[]> => {
  return (await axios.get<FollowWithUser[]>('http://localhost:8088/api/me/follows')).data
}

export const responseFollowRequest = async (id: string, approve: boolean): Promise<void> => {
  await axios.post(`http://localhost:8088/api/follows/${id}`, { approve: approve })
}

export const getFollowers = async (id: string): Promise<User[]> => {
  return (await axios.get<User[]>(`http://localhost:8088/api/users/${id}/followers`)).data
}

export const getFollowees = async (id: string): Promise<User[]> => {
  return (await axios.get<User[]>(`http://localhost:8088/api/users/${id}/followees`)).data
}

export const getUser = async (id: string): Promise<UserDetail> => {
  return (await axios.get<UserDetail>(`http://localhost:8088/api/users/${id}`)).data
}

export const getMyListInServers = async (): Promise<ListInServer[]> => {
  return (await axios.get<ListInServer[]>('http://localhost:8088/api/lists')).data
}

export const postListInServer = async (payload: { name: string, comment: string, priority: number, url: string | null, isPublic: boolean }): Promise<ListInServer> => {
  return (await axios.post<ListInServer>('http://localhost:8088/api/lists', {
    name: payload.name,
    comment: payload.comment,
    priority: payload.priority,
    url: payload.url,
    is_public: payload.isPublic,
  })).data
}

export const getListInServer = async (id: string): Promise<ListInServerWithGames> => {
  return (await axios.get<ListInServerWithGames>(`http://localhost:8088/api/lists/${id}`)).data
}

export const putListInServer = async (id: string, payload: PostListStruct): Promise<void> => {
  await axios.put(`http://localhost:8088/api/lists/${id}`, { name: payload.name, comment: payload.comment, priority: payload.priority, url: payload.url, is_public: payload.isPublic })
}

export const addGameToListInServer = async (id: string, gameIds: number[] ): Promise<void> => {
  await axios.post(`http://localhost:8088/api/lists/${id}`, { game_ids: gameIds })
}

export const deleteGameFromListInServer = async (id: string, gameIds: number[]): Promise<void> => {
  await axios.patch(`http://localhost:8088/api/lists/${id}`, { game_ids: gameIds })
}

export const deleteListInServer = async (id: string): Promise<void> => {
  await axios.delete(`http://localhost:8088/api/lists/${id}`)
}

export const playGame = async (gameId: number): Promise<void> => {
  await axios.post(`http://localhost:8088/api/play/${gameId}`)
}

export const getListInServerByUserId = async (userId: string): Promise<ListInServer[]> => {
  return (await axios.get<ListInServer[]>(`http://localhost:8088/api/users/${userId}/lists`)).data
}
