import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { Grid, Space, Text, Title } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import Layout from './layout'
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import * as cookie from 'cookie'
import { useRouter } from 'next/router'
import logo from '@/public/logo.png'

const inter = Inter({ subsets: ['latin'] })

const SectionTitle = ({title}) => (
    <Title order={4} align='center' transform='uppercase' mb={"lg"}>{title}</Title>
)

const DiscountCardsGrid = ({cards}) => {
  return (
    <Grid gutter={12} className="mt-4 tw-px-3">
      {cards.map(function(card) {
        return (
            <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
              <AssociationCard card={card} />
            </Grid.Col>
          )
      }
      )}
    </Grid>
  )
}

export default function Page(props) {
  console.log('logo', logo)
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
                <SectionTitle title='Carte proche de vous' />
                <DiscountCardsGrid cards={props.cards} />
              </section>
              <Space my={'xl'} h={'md'} />

              {/* Enseigne proche */}
              <section className='tw-mt-12'>
                <SectionTitle title='Enseigne proche de vous' />
                {/* <EnseigneGrid /> */}
              </section>
            </main>

          </div>
        </div>

    </>
  )
}

export async function getServerSideProps(context) {
  const token = context.req.cookies['token']
  const res = await fetch(`${process.env.API_URL}/api/discount-card`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
    )
  const data = await res.json()

  if(data.code == 401) 
  return {
    redirect: {
      permanent: false,
      destination: "/login"
    }
  }
  // // Pass data to the page via props
  return { props: { cards: JSON.parse(data.data) } }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout avatar={logo}>{page}</Layout>
  )
}