import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { Avatar, Box, Button, Card, Center, Container, Flex, Grid, Group, Image, Modal, Paper, Space, Text, Title, Transition } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import Layout from '../../../layout'
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import * as cookie from 'cookie'
import { useRouter } from 'next/router'
import OrganisationCard from '@/components/OrganisationCard'
import OrganisationCardParticulier from '@/components/OrganisationCardParticulier'
import AssociationCardParticulier from '@/components/AssociationCardParticulier'
import CommunicationAdsCarousel from '@/components/CommunicationAdsCarousel'
import PreviousPageButton from '@/components/PreviousPageButton'
import moment from 'moment'
import { getActiveOffers } from '@/domain/repository/CardOffersRepository'
import { FaMapMarkerAlt } from 'react-icons/fa'


export default function Page(props) {
  const [showOffers, setShowOffers] = useState(false);
  const standaloneCard = <>
      <Center>
          <Box className="tw-rounded-xl tw-shadow-lg tw-relative">
              <Image
                  className="tw-absolute tw-z-20 tw-right-1 tw-opacity-80 -tw-translate-y-1/2 tw-top-1/2"
                  width={36}
                  height={36}
                  src={`/sim.png`}
                  alt="logo sim"
              />
              <Image
              className="tw-opacity-95"
              radius={'lg'}
              width={240}
              height={140}
              src={`/uploads/${props.card.image?.name}`}
              alt="Photo de campagne"
              withPlaceholder
              />
          </Box>
      </Center>
      </>

    const OfferRow = ({offer}) => (
      <Card className='tw-flex tw-bg-gray-50 tw-mb-2' radius={'lg'}>
        <Center>
          <Avatar className='tw-shadow-md' radius={'lg'} src={`/uploads/${offer.enseigne?.avatar?.name}`} />
        </Center>
        <Flex direction={'column'} className='tw-flex-1 tw-px-3'>
          <Flex justify={'space-between'}>
            <Text weight={550}>{offer.enseigne.description}</Text>
            <Text className='tw-flex tw-font-light' fz={'sm'}>
              <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />{offer.enseigne?.city}</Text>
          </Flex>
          <Text color='dimmed'>{offer.description}</Text>
        </Flex>
      </Card>
    )

    const offersList = <>
      <Transition mounted={setShowOffers} transition="slide-down" duration={400} timingFunction="ease">
        {(styles) => 
          <section style={styles} className='tw-relative -tw-top-6'>
            {props.offers.map((offer) => (
              <OfferRow key={offer.title} offer={offer} />
            ))}
          </section>}
      </Transition>
    </>


  return (
    <>
        <Head>
          <title>PACE&lsquo;SPORT</title>
          <meta name="description" content="PACE&lsquo;SPORT" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <Container>
            <Box className='tw-relative'>
              <Center className='tw-absolute tw-left-2 tw-top-0.5'>
                <PreviousPageButton href='/' className='' />
              </Center>
              <Flex justify={'center'}>
                <Group position="center" className=''>
                    <Button size='md'
                        className='tw-text-black
                                  tw-px-8 tw-py-3 
                                  tw-bg-gradient-to-br tw-from-gray-200 tw-to-white
                                  tw-shadow-md tw-w-full tw-rounded-2xl
                                  tw-border-2 tw-border-white
                                  hover:tw-bg-gray-200'>J&lsquo;utilise ma carte</Button>
                  </Group>
              </Flex>
            </Box>
            
            <Box>
                <Container className="tw-mt-6">
                <Box className="tw-relative tw-z-[1]">
                    {standaloneCard}
                </Box>
                <Box className="tw-bg-gradient-to-br tw-from-slate-100 tw-to-gray-100 tw-shadow-lg tw-rounded-2xl tw-pt-12 tw-relative -tw-top-10 tw-z-0" p={'md'}>
                    <Title order={3} mb={'sm'} align="center">Pace&lsquo;Sport</Title>
                    <Title order={6} mb={'sm'} align="center">Abonné</Title>
                    <Text className="tw-text-gray-800" align="center" fz={'sm'}>Jusqu&lsquo;au {moment(props.card.endDate).format('DD/MM/YYYY')}</Text>
                    <Center mt={'md'}>
                      <Button onClick={() => setShowOffers(!showOffers)} color='white' variant='outline' className='tw-border-gray-700' radius={'lg'}>
                        <Text className='tw-text-gray-800' transform='uppercase' fz={'sm'}>Voir {showOffers ? 'moins' : 'les offres' }</Text>
                      </Button>
                      {/* <Text className="tw-border-[1px] tw-px-8 tw-py-0.5 tw-border-green-500 tw-bg-green-400 tw-text-gray-50 tw-rounded-xl tw-shadow-md">Possédée</Text> */}
                    </Center>
                </Box>
                  {showOffers && 
                    <Transition mounted={setShowOffers} transition="fade" duration={800} timingFunction="ease">
                      {(styles) => 
                        <section style={styles} className='tw-relative -tw-top-6'>
                          {props.offers.map((offer) => (
                            <OfferRow key={offer.title} offer={offer} />
                          ))}
                        </section>}
                  </Transition>}
                </Container>
            </Box>
        </Container>

    </>
  )
}

export async function getServerSideProps(context) {
  const token = context.req.cookies['token']
  let avatar = await fetch(`${process.env.API_URL}/api/user/avatar`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  avatar = await avatar.json();

  let offers = await getActiveOffers(token)

  // // Pass data to the page via props
  return { props: {
    avatar: avatar.filename,
    card: {
        image: {
            name: null
        },
        startDate: Date.now(),
        endDate: Date.now(),
        price: 11.99
    },
    offers: JSON.parse(offers.data)
  } }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout avatar={null}>{page}</Layout>
  )
}