import { Role, Provider } from 'src/interfaces/user'

export type Identity = {
  name?: string
  username?: string
  birthday?: string
  isDaddy?: boolean
  hasBoat?: boolean
  createdAt?: string
  updatedAt?: string
  bio?: string
  aboutBoat?: string
  boatImage?: string
}

export type User = {
  id: number | null
  name: string | null
  email: string | null
  image?: string | null
  roles?: Role[] | null
  identity?: Identity
}

export type Session = {
  provider: Provider
  userId: number
  username: string
  roles: Role[] | null
}
