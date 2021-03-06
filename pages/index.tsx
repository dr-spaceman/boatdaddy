import { Button } from 'matterial'
import Head from 'next/head'
import Image from 'next/image'

import Layout from 'components/Layout'
import classes from 'styles/index.module.scss'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Boat Daddy</title>
        <meta
          name="description"
          content="Hail a boat daddy to take you on an adventure"
        />
      </Head>
      <main>
        <p className={classes.heading}>
          <strong>Boat Daddy</strong> is the boat hailing app that connects you
          to daddies on boats nearby.
        </p>
        <div className={classes.hero}>
          <Button to="/hail" variant="contained" color="secondary" size="large">
            Hail a Boat Daddy
          </Button>
          <Image
            src="/img/hero_redshortsdaddy.jpg"
            alt="Boat daddy in red shorts"
            width={1920}
            height={1280}
          />
        </div>
      </main>
    </Layout>
  )
}
