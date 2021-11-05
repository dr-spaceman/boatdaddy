import { Profile as ProfileType } from '../user'

export type Profile = ProfileType

export interface Profile_data {
  profile: Profile | null
}

export interface ProfileVariables {
  username: string
}
