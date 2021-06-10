import Head from 'next/head'

import Layout from '@/components/Layout'

export default function Home() {
    return (
        <Layout>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h2>Hello World</h2>
                <p>
                    Voluptate proident ea aliquip laborum dolor aliqua. Lorem
                    anim commodo cillum et nulla ex labore ea ex reprehenderit
                    voluptate. Eiusmod ex incididunt cillum dolor cupidatat
                    cillum adipisicing.
                </p>
            </main>
        </Layout>
    )
}
