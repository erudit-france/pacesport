import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { Box, Button, Center, Grid, Group, Modal, Space, Text, Title } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import Layout from './layout'
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import * as cookie from 'cookie'
import { useRouter } from 'next/router'
import OrganisationCard from '@/components/OrganisationCard'
import OrganisationCardParticulier from '@/components/OrganisationCardParticulier'
import AssociationCardParticulier from '@/components/AssociationCardParticulier'
import CommunicationAdsCarousel from '@/components/CommunicationAdsCarousel'
import AssociationCarte from '@/components/AssociationCarte'

const inter = Inter({ subsets: ['latin'] })

const SectionTitle = (props) => (
    <Title {...props} order={4} align='center' transform='uppercase' mb={"lg"}>{props.children}</Title>
)

const DiscountCardsGrid = ({cards}) => {
  return (
    <Grid gutter={12} className="mt-4 tw-px-3">
      {cards.map(function(card) {
        return (
            <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
              <AssociationCardParticulier card={card} />
            </Grid.Col>
          )
      }
      )}
    </Grid>
  )
}

export default function Page(props) {
  const [opened, setOpened] = useState(false);
  const associations = props.associations.map((card) => 
    <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
      <AssociationCarte organisation={card} />
    </Grid.Col>
  )

  const associationsGrid = props.associations.length == 0
    ? <Text fz={'sm'} align="center" color="dimmed">Aucune association enregistrée</Text>
    : <Grid gutter={18} className="tw-px-4">{associations}</Grid>

  return (
    <>
        <Head>
          <title>PACE&lsquo;SPORT</title>
          <meta name="description" content="PACE&lsquo;SPORT" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <div className={''} >
              <SectionTitle className='tw-text-white tw-text-xl tw-mb-6'>Bienvenue sur Pace&lsquo;Sport</SectionTitle>

              {/* Enseigne proche */}
              <section className='tw-mt-2'>
                <SectionTitle className='tw-text-gray-800 tw-text-base'>Associations proche de vous</SectionTitle>
                {/* search input */}
                <section className='tw-px-8 tw-mb-4'>
                  <SearchInput />
                </section>
                {/* <EnseigneGrid /> */}
                {associationsGrid}
              </section>

              {/* <Group position="center" m={'md'}>
                <Button size='lg'
                    className='tw-text-black 
                              tw-bg-gradient-to-br tw-from-gray-200 tw-to-white
                              tw-shadow-md tw-w-full tw-rounded-2xl
                              tw-border-2 tw-border-white
                              hover:tw-bg-gray-200'
                    onClick={() => setOpened(true)}>J&lsquo;utilise ma carte</Button>
              </Group> */}

              {/* Communication */}
              {/* {props.communications.length > 0 &&
                <Center p={'sm'}>
                  <CommunicationAdsCarousel communications={props.communications} />
                </Center>
              } */}


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

  let possessedCardsRes = await fetch(`${process.env.API_URL}/api/discount-card-user`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
    )
  possessedCardsRes = await possessedCardsRes.json()
  

  let avatar = await fetch(`${process.env.API_URL}/api/user/avatar`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  avatar = await avatar.json();

  // fetch Associations
  let associations = await fetch(`${process.env.API_URL}/api/association/list`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  associations = await associations.json();


  let communications = await fetch(`${process.env.API_URL}/api/communication/all`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  communications = await communications.json();
  

  // // Pass data to the page via props
  return { props: {
    cards: JSON.parse(data.data),
    avatar: avatar.filename,
    associations: JSON.parse(associations.data),
    possessedCards: JSON.parse(possessedCardsRes.data),
    communications: JSON.parse(communications.data)
  } }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout avatar={null}>{page}</Layout>
  )
}