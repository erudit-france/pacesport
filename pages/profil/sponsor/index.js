import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { ActionIcon, Box, Button, Flex, Grid, Group, Space, Text, Title } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import Layout from './layout'
import { IoMdSettings } from 'react-icons/io'
import { MdQrCode2 } from 'react-icons/md'
import { GoMegaphone } from 'react-icons/go'
import Link from 'next/link'
import OrganisationCard from '@/components/OrganisationCard'

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

const DiscountCardsGridBusiness = ({cards}) => {
    return (
        <Box className='tw-bg-yellow-600/60 tw-p-3'>
            <Title order={5} className='tw-text-gray-100 tw-pb-2'>A la une</Title>
            <Grid gutter={12} className="mt-4">
            {cards.map(function(card) {
            return (
                <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
                    <AssociationCard card={card} />
                </Grid.Col>
                )
            }
            )}
        </Grid>
      </Box>
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

  const associations = props.associations.map((card) => 
    <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
      <OrganisationCard organisation={card} />
    </Grid.Col>
  )

  const associationsBusiness = props.associations.length > 2 
    ? props.associations.slice(0,2).map((card) => 
    <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
      <OrganisationCard organisation={card} />
    </Grid.Col>)
    : ''

  const associationsGrid = props.associations.length == 0
    ? <Text fz={'sm'} align="center" color="dimmed">Aucune association enregistrée</Text>
    : <Grid gutter={12} className="mt-4 tw-px-3">{associations}</Grid>

  const associationsGridBusiness = props.associations.length == 0
    ? <Text fz={'sm'} align="center" color="dimmed">Aucune association enregistrée</Text>
    : <Grid gutter={12} className="mt-4 tw-px-3">{associationsBusiness}</Grid>


  return (
    <>
        <Head>
          <title>PACE&lsquo;SPORT</title>
          <meta name="description" content="PACE&lsquo;SPORT" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={ `${styles.main}` } >
            <main className='container'>
              {/* search input */}
              <section className='tw-relative -tw-top-4 tw-mx-6'>
                <SearchInput />
              </section>

              <Flex direction={'column'} className='tw-bg-gray-300' py={'lg'} justify={'space-between'}>
                <Link href='/' className='tw-flex tw-justify-center'>
                  <Button className='tw-text-gray-900 tw-bg-white tw-border-[1] tw-border-gray-800 hover:tw-bg-gray-100 tw-uppercase tw-font-bold' w={'90%'} variant='filled' radius={'xl'}> 
                    Mes partenariats actifs</Button></Link>
                <Space h={'md'}/>
                <Link href='/' className='tw-flex tw-justify-center'>
                  <Button className='tw-text-gray-900 tw-bg-white tw-border-[1] tw-border-gray-800 hover:tw-bg-gray-100 tw-uppercase tw-font-bold' w={'90%'} variant='filled' radius={'xl'}> 
                  Mes cartes Actives</Button></Link>
              </Flex>
              

              <CardsSection title="Offres de partenariat de mon réseau">
                <Text align='center' color='dimmed'>Aucune offre enregistrée</Text>
              </CardsSection> 

              <Space h={'lg'} my={'md'} />
              
              {/* carte proche */}
              <CardsSection title="Prochaines cartes près de vous">
                <DiscountCardsGrid cards={props.cards} />
              </CardsSection> 

              <Space h={'lg'} my={'md'} />

              <CardsSection title="Associations près de vous">
                
                <Box className='tw-bg-yellow-600/60 tw-p-3'>
                    <Title order={5} className='tw-text-gray-100 tw-pb-2'>A la une</Title>
                    {associationsGridBusiness}
                </Box>
                <Space my={'md'} />
                {associationsGrid}
              </CardsSection> 
            </main>
            <Space py={'xl'} />
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

  // // Pass data to the page via props
  return { props: { 
    backgroundImage: backgroundImage.filename,
    cards: JSON.parse(data.data),
    avatar: avatar.filename,
    associations: JSON.parse(associations.data)
  } }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}