import { BiInfoCircle as InfoIcon } from 'react-icons/bi'

import { User } from 'interfaces/api/user'
import BoatImage from 'components/BoatImage'
import Button, { IconButton } from 'components/Button'
import { ProfileAvatar, BoatName } from 'components/Profile'
import Tooltip from 'components/Tooltip'
import classes from 'styles/driver-card.module.scss'

export default function DriverCard({ user }: { user: User }) {
  return (
    <div className={`surface ${classes.driverCard}`}>
      <Tooltip label={`@${user.username}`}>
        <header>
          <h5>{user.profile.name || user.username}</h5>
          <ProfileAvatar user={user} size={30} />
        </header>
      </Tooltip>

      <dl>
        <dt>📍</dt>
        <dd>New York</dd>
        <dt>🛥️</dt>
        <dd>
          <BoatName>{user.profile.boatName}</BoatName>
        </dd>
      </dl>

      <div className={classes.boatImage}>
        {user.profile.boatImage && (
          <BoatImage
            src={user.profile.boatImage}
            alt={`${user.username}'s boat`}
            width={200}
            height={133}
          />
        )}
      </div>

      <footer>
        <Button
          variant="contained"
          color="primary"
          to={`/hail/?driver=${user.username}`}
        >
          Hail {user.username} dfoaj; jjifaifijjaijfdoijdas
        </Button>
        <IconButton size="large" to={`/@${user.username}`}>
          <InfoIcon />
        </IconButton>
      </footer>
    </div>
  )
}
