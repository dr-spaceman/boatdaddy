import { getBoundsOfDistance } from 'geolib'

import { Context } from 'interfaces/api/context'
import {
  NearbyDrivers_variables,
  User,
  UserUpdateInput_input,
  UserDeleteInput_input,
  UserVariables,
  UserListVariables,
  UserList,
} from 'interfaces/api/user'
import { DeleteResult } from 'interfaces/api/globalTypes'
import userResolver from 'api/user'

type SimpleUserAddInput = {
  input: {
    email: string
    image?: string
    name: string
    username: string
  }
}

const MOCK_USER = {
  id: 1,
  username: 'john_daddy',
  email: 'john_daddy@boatdaddy.app',
  image: 'cloudinaryPublicId=hero_redshortsdaddy_khqgav',
  createdAt: new Date(2021, 6, 1),
  updatedAt: new Date(2021, 6, 2),
  profile: {
    name: 'John Daddy',
    aboutBoat: 'Take a good long look at this mother fucking boat',
    bio: "Aw shit get your towels ready because it's about to go down",
    birthday: new Date('1980-01-01'),
    boatImage: 'cloudinaryPublicId=damian-barczak-p-GrqI8OSqI-unsplash_fnv5lo',
    boatName: 'USS Daddy',
    isBoatDaddy: true,
    createdAt: new Date(2021, 6, 1),
    updatedAt: new Date(2021, 6, 1),
    userId: 1,
  },
  roles: ['RIDER', 'DRIVER', 'ADMIN'],
}

const seed = async (_, __, ctx: Context): Promise<DeleteResult> => {
  const { prisma } = ctx

  let result = { success: false, numberDeleted: 0, message: null }

  try {
    await prisma.actor.deleteMany({})
    await prisma.profile.deleteMany({})
    const delResult = await prisma.user.deleteMany({})

    console.log('Delete users result', delResult)

    result.numberDeleted = delResult.count

    const { profile, roles, ...userData } = MOCK_USER
    delete profile.userId

    const johnDaddy = await prisma.user.upsert({
      where: { email: MOCK_USER.email },
      update: {},
      create: {
        ...userData,
        profile: {
          create: { ...profile },
        },
        actor: {
          create: [{ role: 'RIDER' }, { role: 'DRIVER' }, { role: 'ADMIN' }],
        },
      },
    })

    result.message = `Deleted all ${
      result.numberDeleted
    } users and inserted new user: ${JSON.stringify(johnDaddy, null, 2)}`
    result.success = true

    return result
  } catch (err) {
    console.error(err)

    return { success: false, numberDeleted: 0, message: String(err) }
  }
}

const get = async (
  _,
  vars: UserVariables,
  ctx: Context
): Promise<User | null> => {
  const getResult = await userResolver.get(vars)

  return getResult
}

const getAll = async (_, __, ctx: Context): Promise<UserList> => {
  const getAllResult = await userResolver.getAll()

  return {
    users: getAllResult,
    pages: 1,
  }
}

const getNearby = async (
  _,
  {
    latitude,
    longitude,
    within,
    bounds: boundsString,
  }: NearbyDrivers_variables,
  ctx: Context
): Promise<User[]> => {
  if (boundsString) {
    const bounds: number[][] = JSON.parse(boundsString)
    const where = {
      profile: { isBoatDaddy: true },
      ...(ctx?.session?.userId && {
        id: { not: { equals: ctx.session.userId } },
      }),
      latitude: { gte: bounds[0][1], lte: bounds[1][1] },
      longitude: { gte: bounds[0][0], lte: bounds[1][0] },
    }
    console.log('getNearby', where)
    const users = await ctx.prisma.user.findMany({
      include: { profile: true, actor: true },
      where,
      take: 25,
    })
    console.log('found', users)

    return users ? users.map(user => userResolver.attachRoles(user)) : null
  }

  const users = await ctx.prisma.user.findMany({
    include: { profile: true, actor: true },
    where: {
      profile: { isBoatDaddy: true },
      id: { not: { equals: ctx.session.userId } },
    },
    take: 25,
  })

  return users.map(user => userResolver.attachRoles(user))
}

const list = async (
  _,
  vars: UserListVariables,
  ctx: Context
): Promise<UserList> => {
  const { isBoatDaddy } = vars
  const { prisma } = ctx

  if (typeof isBoatDaddy !== undefined) {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        actor: true,
      },
      where: {
        profile: {
          isBoatDaddy: true,
        },
      },
    })

    console.log('User list', vars, users)

    if (!users.length) {
      return { users: [], pages: 1 }
    }

    const usersWithRoles = users.map(user => userResolver.attachRoles(user))

    return { users: usersWithRoles, pages: 1 }
  }

  throw new Error(
    `Could not find the requested resource using the given variables ${vars}`
  )
}

const add = async (
  _,
  { input }: SimpleUserAddInput,
  ctx: Context
): Promise<User> => {
  const user = {
    ...input,
    profile: { name: input.name, isBoatDaddy: false },
  }
  delete user.name

  const addResult = await userResolver.add(user)

  return addResult
}

const update = async (
  _,
  vars: UserUpdateInput_input,
  ctx: Context
): Promise<User> => {
  const { id, input } = vars
  const updateResult = await userResolver.update(id, input)

  return updateResult
}

const remove = async (
  _,
  vars: UserDeleteInput_input,
  ctx: Context
): Promise<DeleteResult> => {
  const { id } = vars
  const deleteResult = await userResolver.delete(id)

  return deleteResult
}

export default {
  seed,
  get,
  getAll,
  getNearby,
  list,
  add,
  update,
  delete: remove,
  attachRoles: userResolver.attachRoles,
}
