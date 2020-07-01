import { Campaign } from 'src/types/root'

export type S = {
  campaigns: Campaign[]
}

export const state: S = {
  campaigns: [],
}
