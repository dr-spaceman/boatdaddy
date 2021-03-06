import { PrismaClient } from '@prisma/client'
import { Session } from 'interfaces/user'

export interface Context {
  session: Session | null
  prisma: PrismaClient
}

export interface AuthorizedContext extends Context {
  session: Session
}
