import { useRouter } from 'next/router'
import ContentLoader from 'react-content-loader'

import { getUser } from 'src/user'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import ProfileView from 'src/components/Profile'

const Loader = () => (
  <ContentLoader
    speed={2}
    width={350}
    height={300}
    viewBox="0 0 350 300"
    // backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <circle cx="60" cy="60" r="60" />
    <rect x="140" y="20" rx="3" ry="3" width="140" height="10" />
    <rect x="140" y="50" rx="2" ry="2" width="140" height="10" />
    <rect x="140" y="80" rx="2" ry="2" width="140" height="10" />
    <rect x="208" y="212" rx="0" ry="0" width="1" height="0" />
    <rect x="0" y="137" rx="0" ry="0" width="350" height="150" />
  </ContentLoader>
)

function ProfileLayout({ username }) {
  const { data, error, loading } = getUser({ username })

  if (error) {
    console.error(error)

    return <ErrorPage title="Oops" message="Something went wrong" />
  }

  return (
    <Layout>
      <main>
        <h1>{username}</h1>
        {!data || loading ? <Loader /> : <ProfileView user={data} />}
      </main>
    </Layout>
  )
}

function Profile() {
  const { query } = useRouter()

  const username = query?.username?.slice(1) as string

  if (!username) {
    return <ErrorPage title="Error" message="Please enter a username" />
  }

  return <ProfileLayout username={username} />
}

export default Profile
