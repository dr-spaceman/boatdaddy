import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'
import { AuthChecker, registerEnumType } from 'type-graphql'
import {
  Field,
  ObjectType,
  Int,
  Mutation,
  Authorized,
  Resolver,
  ID,
  Query,
  Arg,
  Ctx,
} from 'type-graphql'
import { Min, Max } from 'class-validator'

import { Context, AuthorizedContext } from './context'

const USER_LEVELS = {
  guest: 0,
  customer: 1,
  manager: 2,
  admin: 3,
}

let { JWT_SECRET } = process.env
if (!JWT_SECRET) {
  if (process.env.NODE_ENV !== 'production') {
    JWT_SECRET = '__tempjwtsecretfordevonly__'
    console.warn('Missing env var JWT_SECRET. Using unsafe secret for dev env.')
  } else {
    throw new AuthenticationError(
      'Missing env var JWT_SECRET. Authentication cannot proceed.'
    )
  }
}

enum AuthMethod {
  Google = 'GOOGLE',
  Test = 'TEST',
}
registerEnumType(AuthMethod, {
  name: 'Auth Methods',
  description: 'Authorization methods, including third party APIs',
})

@ObjectType()
class Session {
  @Field(type => AuthMethod)
  method: AuthMethod

  @Field()
  name: string

  @Field()
  email: string

  @Field(type => Int)
  id: number

  // @Field()
  // isLoggedIn: boolean
}

@Resolver(Session)
export class SessionResolver {
  // constructor(ctx: Context) {}

  @Query(returns => Session, { nullable: true })
  async profile(@Ctx() ctx: Context): Promise<Session | null> {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.uid },
      select: { name: true, email: true, id: true },
    })

    if (!user || Object.keys(user).length === 0) {
      return null
      //`The requested resource (username '${username}') could not be found`,
    }

    return { method: AuthMethod.Test, ...user }
  }
}

const authChecker: AuthChecker<Context> = ({ context }) => {
  const { uid } = context
  return !!uid
}

function getJwt(req: NextApiRequest) {
  const header = req.headers.authorization

  if (typeof header === 'undefined') {
    return null
  }

  const bearer = header.split(' ')
  const token = bearer[1]

  return token
}

function getSession(req: NextApiRequest): Session | {} {
  const token = getJwt(req)
  if (!token) {
    return {}
  }

  try {
    const credentials = jwt.verify(token, JWT_SECRET)

    return credentials
  } catch (error) {
    console.error(error)

    return {}
  }
}

// Clear cookie upon logout (With JWT enabled it's handled on frontend)
// routes.use('/logout', async (req, res) => {
//     res.clearCookie('jwt');
//     res.json({ status: 'ok', user: getUser(req) });
// });

function getUserLevel(levelString) {
  if (USER_LEVELS[levelString]) {
    return USER_LEVELS[levelString]
  }

  return 0
}

function mustBeLoggedIn(resolver) {
  return (root, args, { user }) => {
    if (!user || !user.isLoggedIn) {
      throw new AuthenticationError('Must be signed in')
    }

    return resolver(root, args, { user })
  }
}

function mustBeManager(resolver) {
  return (root, args, { user }) => {
    if (!user || USER_LEVELS[user.level] < USER_LEVELS.manager) {
      throw new ForbiddenError('Not authorized to perform this action')
    }

    return resolver(root, args, { user })
  }
}

function mustBeAdmin(resolver) {
  return (root, args, { user }) => {
    if (!user || USER_LEVELS[user.level] < USER_LEVELS.admin) {
      throw new ForbiddenError('Not authorized to perform this action')
    }

    return resolver(root, args, { user })
  }
}

/**
 * A NON-RESOLVER function to check user actions
 *
 * @param {object} owner A user object; Must have `id` prop
 * @param {object} user A user object; Must have `id` and `level` props
 * logging purposes only
 */
function verifyIsOwner(owner, user, action) {
  if (
    owner.id !== user.id &&
    getUserLevel(user.level) < getUserLevel('manager')
  ) {
    throw new ForbiddenError('Not authorized to perform this action')
  }
}

export { JWT_SECRET, authChecker, getSession }
