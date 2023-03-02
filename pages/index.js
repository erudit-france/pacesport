import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Navbar from '@/components/navbar/Navbar'
import logo from '../public/logo.png'
import hero from '../public/hand-in-hand.jpg'
import SearchInput from '@/components/SearchInput'
import { Grid } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import EnseigneCard from '@/components/EnseigneCard'

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
          <Navbar />
          <div>
            <header className='tw-flex tw-justify-center tw-h-36 tw-relative'>
              <div className='tw-flex tw-flex-col tw-justify-center'>
                <Image src={logo} height={70} width={70} alt="Logo Pace'sport" 
                      className='tw-rounded-full shadow-sm tw-bg-white tw-p-2'/>
              </div>
              <Image className='tw-w-full tw-h-full tw-absolute tw-object-cover -tw-z-10 tw-blur-sm tw-scale-110' src={hero} placeholder='blur' alt="Hero image"/>
            </header>


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
