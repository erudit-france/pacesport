import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Navbar from '@/components/navbar/Navbar'
import SearchInput from '@/components/SearchInput'
import { Grid } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import EnseigneCard from '@/components/EnseigneCard'
import HeroSection from '@/components/HeroSection'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
        <Head>
          <title>PACE&lsquo;SPORT</title>
          <meta name="description" content="PACE&lsquo;SPORT" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={ `${styles.main}` } >
          <div>

            <main className='container '>
              {/* search input */}
              <section>
                <SearchInput />
              </section>

              {/* carte proche */}
              <section className='tw-mt-8'>
                <h1 className="tw-text-lg tw-font-semibold tw-uppercase tw-text-center">Carte proche de vous</h1>
                <Grid gutter={12} className="mt-4">
                  {[0,1,2,3].map(function(o) {
                    return (
                        <Grid.Col key={o} span={6} xs={6} xl={3}>
                          <AssociationCard />
                        </Grid.Col>
                      )
                  }
                  )}
                </Grid>
              </section>

              {/* Enseigne proche */}
              <section className='tw-mt-12'>
                <h1 className="tw-text-lg tw-font-semibold tw-uppercase tw-text-center">Enseigne proche de vous</h1>
                <Grid gutter={12} className="mt-4">
                  {[0,1,2,3].map(function(o) {
                    return (
                        <Grid.Col key={o} span={6} xs={6} xl={3}>
                          <EnseigneCard />
                        </Grid.Col>
                      )
                  }
                  )}
                </Grid>
              </section>
            </main>

          </div>
        </div>

    </>
  )
}
