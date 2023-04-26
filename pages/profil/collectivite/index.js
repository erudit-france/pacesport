import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { ActionIcon, Box, Button, Flex, Grid, Group, Space, Text, Title } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import Layout from './layout'
import { IoMdSettings } from 'react-icons/io'
import { MdQrCode2 } from 'react-icons/md'
import { GoMegaphone } from 'react-icons/go'
import Link from 'next/link'
import AssociationInvitation from '@/components/AssociationInvitation'

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
  return (
    <>
        <Head>
          <title>PACE&lsquo;SPORT</title>
          <meta name="description" content="PACE&lsquo;SPORT" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <Group className='tw-flex-col tw-absolute tw-right-3 tw-top-4' spacing={'md'}>
            <ActionIcon 
                className='tw-text-black tw-rounded-full tw-bg-white tw-shadow-sm'><IoMdSettings /></ActionIcon>
            <ActionIcon 
                className='tw-text-black tw-rounded-full tw-bg-white tw-shadow-sm'><MdQrCode2 /></ActionIcon>
            <ActionIcon component='a' href='/communication/add' 
                className='tw-text-black tw-rounded-full tw-bg-white tw-shadow-sm'><GoMegaphone /></ActionIcon>
        </Group>

        <div className={ `${styles.main}` } >
            <main className='container'>
              {/* search input */}
              <section className='tw-relative -tw-top-4 tw-mx-6'>
                <SearchInput />
              </section>



              <Flex direction={'column'} className='tw-bg-gray-300' py={'lg'} justify={'space-between'}>
                <Box mx={'lg'}>
                    <AssociationInvitation />
                </Box>
                <Space h={'md'}/>
                <Link href='/' className='tw-flex tw-justify-center'>
                  <Button className='tw-text-gray-900 tw-bg-white tw-border-[1] tw-border-gray-800 hover:tw-bg-gray-100 tw-uppercase tw-font-bold' w={'90%'} variant='filled' radius={'xl'}> 
                  Mon réseau d&lsquo;associations</Button></Link>
              </Flex>
              

              <CardsSection title="Offres de partenariat de mon réseau">
                <DiscountCardsGrid cards={props.cards} />
              </CardsSection> 

              {/* carte proche */}
              <CardsSection title="Prochaines cartes près de vous">
                <DiscountCardsGrid cards={props.cards} />
              </CardsSection> 

              <CardsSection title="Associations près de vous">
                <DiscountCardsGridBusiness cards={props.cards} />
                <Space my={'md'} />
                <DiscountCardsGrid cards={props.cards} />
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

  if(data.code == 401) 
  return {
    redirect: {
      permanent: false,
      destination: "/login"
    }
  }

  // fetch avatar
  let avatar = await fetch(`${process.env.API_URL}/api/enseigne/avatar`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  avatar = await avatar.json();
  console.log('avatar', avatar)
  if (avatar.code == 401) {
      return {
          redirect: {
          permanent: false,
          destination: "/login"
          }
      }
  }

  // // Pass data to the page via props
  return { props: { 
    cards: JSON.parse(data.data),
    avatar: avatar.filename
  } }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}