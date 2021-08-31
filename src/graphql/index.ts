import { buildSchemaSync, Resolver, Query } from 'type-graphql'
import { ImageResolver } from './image'
import { ProfileResolver } from './profile'
import { authChecker } from './auth'

const ABOUT = 'Boat Daddy API 1.0'

@Resolver()
class AboutResolver {
  @Query(_returns => String)
  about() {
    return ABOUT
  }
}

export const schema = buildSchemaSync({
  resolvers: [AboutResolver, ImageResolver, ProfileResolver],
  emitSchemaFile: process.env.NODE_ENV === 'development',
  authChecker,
})
