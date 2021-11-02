import { useQuery, gql } from '@apollo/client'

import { User } from 'src/interfaces/user'
import { UserVariables, User_data } from 'src/interfaces/api/User'

const USER_QUERY = gql`
  query User($username: String, $id: Int) {
    user(username: $username, id: $id) {
      id
      username
      email
      emailVerified
      image
      createdAt
      updatedAt
      profile {
        name
        birthday
        isDaddy
        bio
        hasBoat
        aboutBoat
        boatImage
        createdAt
        updatedAt
      }
    }
  }
`

export const USERNAME_TESTS = [
  {
    test: (value: string) => /^[a-z]/i.test(value),
    message: 'Username must begin with a letter',
  },
  {
    test: (value: string) => value.length >= 3,
    message: 'Username must be at least three characters long',
  },
  {
    test: (value: string) => value.length <= 25,
    message: 'Username must be 25 characters or less',
  },
  {
    test: (value: string) => /\s/.test(value) == false,
    message: 'Username cannot contain any space characters',
  },
]

/**
 * Hook to fetch a specific user from API
 */
export function getUser(variables: UserVariables): {
  data: User
  error: any
  loading: boolean
} {
  const { data, error, loading } = useQuery<User_data, UserVariables>(
    USER_QUERY,
    {
      variables,
    }
  )

  return { data: data?.user, error, loading }
}
