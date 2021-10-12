import { useEffect, useReducer, useRef } from 'react'
import { useRouter } from 'next/router'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'
import { Dialog } from '@reach/dialog'
import { VisuallyHidden } from '@reach/visually-hidden'

import { useAuth } from 'src/context/auth-context'
import useAlert from 'src/lib/use-alert'
import { Form, SubmitRow } from './Form'
import Button from './Button'
import Avatar from './Avatar'
import CheckButton, { checkButtonContainerClass } from './CheckButton'
import formClasses from 'styles/components/form.module.scss'

export default function NavAuthenticated() {
  const auth = useAuth()
  const router = useRouter()

  const signOut = () => {
    router.push('/logout')
  }

  const image = null

  return <div>{JSON.stringify(auth.data, null, 2)}</div>

  return (
    <Menu>
      <MenuButton as={Avatar} alt={auth.data.username} src={image}>
        {auth.username.slice(0, 1)}
      </MenuButton>
      <MenuList>
        <MenuItem onSelect={() => router.push('/rides')}>My Rides</MenuItem>
        <MenuItem onSelect={() => router.push(`/@${auth.data.username}`)}>
          Profile
        </MenuItem>
        <MenuItem onSelect={() => router.push('/account')}>
          Account Settings
        </MenuItem>
        <MenuItem onSelect={() => signOut()}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  )
}
