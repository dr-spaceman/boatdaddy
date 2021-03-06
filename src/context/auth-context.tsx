import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Session, Provider } from 'interfaces/user'
import { Auth_data } from 'interfaces/api/auth'
import useLocalStorage from 'lib/use-local-storage'
import { getUserAsync } from 'lib/user'
import graphQlFetch from 'api/graphql/fetch'

/**
 * Object to send in HTTP body request at auth API
 */
export type AuthBody = {
  provider: Provider
  token: string
  email?: string
  password?: string
}

interface AuthResponseCredentials {
  email: string
  jwt: string
  name: string
  provider: Provider
}

/**
 * JSON returned in response
 */
export type AuthResponse = {
  credentials?: AuthResponseCredentials
  session?: Session
  error?: string
}

const AUTH_QUERY = `
  query {
    auth {
      provider
      userId
      username
      roles
    }
  }
`

const AuthContext = createContext(undefined)

function AuthProvider(props) {
  const [data, setData] = useState<Session>(null)
  const [jwt, setJwt] = useLocalStorage<string>('jwt', '')
  const [loading, setLoading] = useState(!!jwt)

  const geolocationAsk = useRef(false)

  // If token persists in localStorage, query API for user session
  // Authorization with bearer token is automatically attached to the request
  useEffect(() => {
    if (!jwt) {
      return
    }

    const fetchData = async () => {
      const authRes = await graphQlFetch<Auth_data>(AUTH_QUERY)
      if (!authRes.data) {
        return
      }
      if (!authRes.data.auth) {
        setData(null)

        return
      }

      const user = await getUserAsync({ id: authRes.data.auth.userId })
      if (!user) {
        return
      }

      geolocationAsk.current = true

      const session: Session = {
        provider: authRes.data.auth.provider,
        userId: user.id,
        username: user.username,
        roles: user.roles,
      }

      setData(session)
      setLoading(false)
    }
    fetchData()
  }, [jwt])

  const login = async (params: AuthBody) => {
    const response = await fetch(`/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const body = await response.text()
    const result: AuthResponse = JSON.parse(body)

    console.log('login result', result)

    if (result.error) {
      throw new Error(result.error)
    }

    const { credentials } = result
    if (!credentials) {
      throw new Error('No credentials found')
    }

    const { jwt } = credentials
    if (!jwt) {
      throw new Error('Missing JWT from credentials')
    }

    setJwt(jwt)
  }

  const register = () => {} // register the user

  const logout = () => {
    // clear the token in localStorage and the user data
    setJwt('')
    setData(null)
  }

  const value = useMemo(
    () => ({ loading, data, login, logout, register, geolocationAsk }),
    [loading, data, login, logout, register, geolocationAsk]
  )

  return <AuthContext.Provider value={value} {...props} />
}

function useAuth(): {
  loading: boolean
  data: Session
  login: (params: AuthBody) => Promise<null>
  logout: () => void
  register: () => void
  geolocationAsk: any // React reference
} {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }

  return context
}

export { AuthProvider, useAuth }
