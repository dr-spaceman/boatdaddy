import { useQuery, gql } from '@apollo/client'
import Image from 'next/image'

import Layout from 'components/Layout'
import classes from 'styles/about.module.scss'
import photoAttribution from '../public/img/hero_landscape_attribution'
import photoAttributionHome from '../public/img/hero_redshortsdaddy_attribution'
import { About as AboutType } from 'interfaces/api/about'

const ABOUT_QUERY = gql`
  query About {
    about
  }
`

export default function About() {
  const { data } = useQuery<AboutType>(ABOUT_QUERY)

  return (
    <Layout title="About Boat Daddy">
      <main>
        <h1>About Boat Daddy</h1>
        <figure className={classes.hero}>
          <figcaption>
            <strong>Boat Daddy</strong> is the boat hailing app that connects
            you to daddies on boats nearby.
          </figcaption>
          <Image
            src="/img/hero_landscape.jpg"
            alt="Watery landscape"
            width={1920}
            height={1280}
          />
        </figure>
        <p className={classes.dropCap}>
          Legend has it that the idea for Boat Daddy began on a fortuitous and
          glorious summer day on the Candlewood Lake in Western Connecticut.
          While the exact circumstances of its founding are lost to history, the
          app was willed into being by co-founder and CEO Maranda Cox in June of
          2021 when she used it to hail her very own Boat Daddy somewhere in the
          Shengsi Islands off the coast of China's Zhejiang Province.
        </p>
        <p>
          Anyone can be a{' '}
          <strong className={classes.styledFont}>boat daddy</strong>. We pride
          ourselves in our inclusivity. We want to make your dreams come true,
          whether its connecting to a daddy or fellow boat lover.
        </p>
        <h2>Attribution</h2>
        <p>{photoAttribution}</p>
        <p>{photoAttributionHome}</p>
        <p>{data ? data.about : 'loading API...'}</p>
      </main>
    </Layout>
  )
}
