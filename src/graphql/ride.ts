import { Context } from 'src/interfaces/api/context'
import { DeleteResult } from 'src/interfaces/api/globalTypes'
import userResolver from './user'
import {
  Ride,
  RideAddInput_input,
  RideVariables,
  RideListVariables,
} from 'src/interfaces/api/ride'
import { UserInputError } from 'apollo-server-errors'

async function add(
  _,
  { input }: RideAddInput_input,
  ctx: Context
): Promise<Ride> {
  console.log('Adding ride from input', input)
  const { driverId, riderId } = input
  const { prisma } = ctx

  const driver = await prisma.actor.findFirst({
    where: { userId: driverId, role: 'DRIVER' },
  })
  if (!driver) {
    throw new UserInputError(
      `No driver data for user ID '${driverId}: That user may not exist, or have permission for the role of 'DRIVER'.`
    )
  }

  const rider = await prisma.actor.findFirst({
    where: { userId: riderId, role: 'RIDER' },
  })
  if (!rider) {
    throw new UserInputError(
      `No rider data for user ID '${riderId}: That user may not exist, or have permission for the role of 'RIDER'.`
    )
  }

  const ride = await prisma.ride.create({
    data: {
      startedAt: new Date(),
      driverId: driver.id,
      riderId: rider.id,
    },
  })

  console.log('Ride added', ride)

  return get(_, { id: ride.id }, ctx)
}

async function get(_, vars: RideVariables, ctx: Context): Promise<Ride | null> {
  const { prisma } = ctx

  if (vars.id) {
    const foundRide = await prisma.ride.findUnique({
      where: { id: vars.id },
      include: { rider: true, driver: true },
    })

    const rider = await userResolver.get(_, { id: foundRide.rider.userId }, ctx)
    const driver = await userResolver.get(
      _,
      { id: foundRide.driver.userId },
      ctx
    )

    const ride = {
      ...foundRide,
      rider: { ...foundRide.rider, user: rider },
      driver: { ...foundRide.driver, user: driver },
    }

    return ride
  }

  return null
}

async function list(_, vars: RideListVariables, ctx: Context): Promise<any> {
  const { session, prisma } = ctx
  const rides = await prisma.ride.findMany({
    include: { rider: true, driver: true },
  })

  return rides
}

export default { add, get, list }
