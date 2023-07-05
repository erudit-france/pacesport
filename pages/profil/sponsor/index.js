import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { ActionIcon, Avatar, Box, Button, Card, Center, Flex, Grid, Group, Modal, Space, Text, Title } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import Layout from './layout'
import { IoMdSettings } from 'react-icons/io'
import { MdQrCode2 } from 'react-icons/md'
import { GoMegaphone } from 'react-icons/go'
import Link from 'next/link'
import OrganisationCard from '@/components/OrganisationCard'
import SponsoringOfferCard from '@/components/SponsoringOffer'
import AssociationCarte from '@/components/AssociationCarte'
import { useState } from 'react'
import { getOffers } from '@/domain/repository/CardOffersRepository'
import { FaMapMarkerAlt } from 'react-icons/fa'

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


const CardsSection = (props) => (
        <section className='tw-mt-8'>
            <Title align={"center"} order={6}
                className="tw-uppercase tw-mb-3">
                    {props.title}</Title>
                    {props.children}
        </section>
)

export default function Page(props) {
  const [opened, setOpened] = useState(false);

  const associations = props.associations.map((card) => 
    <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
      <AssociationCarte organisation={card} />
    </Grid.Col>
  )

  const associationsGrid = props.associations?.length == 0
    ? <Text fz={'sm'} align="center" color="dimmed">Aucune association enregistrée</Text>
    : <Grid gutter={12} className="mt-4 tw-px-3">{associations}</Grid>

    
  const OfferRow = ({offer}) => (
    <Card className='tw-flex tw-bg-gray-50 tw-mb-2' radius={'lg'}>
      <Center>
        <Avatar className='tw-shadow-md' radius={'lg'} src={offer.img} />
      </Center>
      <Flex direction={'column'} className='tw-flex-1 tw-px-5'>
        <Flex justify={'space-between'}>
          <Text fz={'sm'} weight={550}>{offer.title}</Text>
        </Flex>
        <Text color='dimmed'>{offer.description}</Text>
      </Flex>
      <Center>
        <Text className='tw-font-semibold' fz={'sm'}>Status</Text>
      </Center>
    </Card>
  )

  const offersList = <>
    <section style={styles} className='tw-px-3'>
      {props.offers.map((offer) => (
        <OfferRow key={offer.title} offer={offer} />
      ))}
    </section>
  </>

  return (
    <>
        <Head>
          <title>PACE&lsquo;SPORT</title>
          <meta name="description" content="PACE&lsquo;SPORT" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={ `${styles.main}` } >
            <main className='container tw-mt-6'>
              {/* search input */}
              {/* <section className='tw-relative -tw-top-4 tw-mx-6'>
                <SearchInput />
              </section> */}
              
              <Flex justify={'center'}>
                <Group position="center" className=''>
                    <Button size='md'
                        onClick={() => setOpened(true)}
                        className='tw-text-black
                                  tw-px-8 tw-py-3 
                                  tw-bg-gradient-to-br tw-from-gray-200 tw-to-white
                                  tw-shadow-md tw-w-full tw-rounded-2xl
                                  tw-border-2 tw-border-white
                                  hover:tw-to-gray-200'>Je soutiens une association</Button>
                  </Group>
              </Flex>

              <CardsSection title="Mes offres">
                  {offersList}
              </CardsSection>



              <CardsSection title="Associations près de vous">
                <Box className='tw-bg-gray-50/60 tw-shadow-inner tw-p-3'>
                    {associationsGrid}
                </Box>
              </CardsSection> 
            </main>
            <Space py={'xl'} />
            <Modal
              radius={'lg'}
              centered
              opened={opened}
              onClose={() => setOpened(false)}
              title="Soutenir une association"
            >

            </Modal>
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

  // fetch avatar
  let avatar = await fetch(`${process.env.API_URL}/api/enseigne/avatar`, {
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
  
  let backgroundImage = await fetch(`${process.env.API_URL}/api/sponsor/background`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  backgroundImage = await backgroundImage.json();

  let sponsoringOffers = await fetch(`${process.env.API_URL}/api/sponsoring-offer`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  sponsoringOffers = await sponsoringOffers.json();

  let offers = await getOffers()

  console.log('offers', offers)
  // // Pass data to the page via props
  return { props: { 
    backgroundImage: backgroundImage.filename,
    cards: JSON.parse(data.data),
    avatar: avatar.filename,
    associations: JSON.parse(associations.data),
    sponsoringOffers: JSON.parse(sponsoringOffers.data),
    offers: offers.data
  } }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}