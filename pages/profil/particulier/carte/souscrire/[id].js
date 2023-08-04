import Head from 'next/head'
import { Avatar, Badge, Box, Button, Card, Center, Container, Flex, Grid, Group, Image, Loader, Modal, Paper, Select, Space, Text, Title, Transition } from '@mantine/core'
import Layout from '../../../../layout'
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import * as cookie from 'cookie'
import { useRouter } from 'next/router'
import PreviousPageButton from '@/components/PreviousPageButton'
import { getActiveOffers } from '@/domain/repository/CardOffersRepository'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { AiOutlineSync } from 'react-icons/ai'
import { useForm } from '@mantine/form'
import SponsoringOfferTypeBadge from '@/components/SponsoringOfferTypeBadge'
import Toast from '@/services/Toast'


export default function Page(props) {
    const [offers, setOffers] = useState(props.offers)
    const { push } = useRouter()
    const [showOffers, setShowOffers] = useState(true)
    const [fetching, setFetching] = useState(false)
    const [selectedAssociation, setSelectedAssociation] = useState(null)
    const selectedAssociationHandler = (association) => {
      setSelectedAssociation(association)
    }
    const associationsSelect = props.associations.map((association) => (
        {label: association.description, value: association.id}
    ))

    const form = useForm({
        initialValues: {
            association: '',
        },
        validate: {
            association: (value) => (value != '' ? null : 'Veuillez saisir choisir une association'),
        },
    });

    const submitHandler = (values) => {
        console.log('values', values)
        push('/profil/particulier/carte')
    }

    useEffect(() => {
      if(selectedAssociation == null){
        return
      }
      console.log('selectedAssociation', selectedAssociation)
      setFetching(true)
      setOffers([])
      fetch(`/api/sponsoring-offer-sponsor-active/${selectedAssociation}`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token')}`,
          })}
      ).then(res => res.json())
      .then(res => {
        if (res.code == 401) {
          Toast.error('Session expirée')
          push('/login')
          setFetching(false)
          return
        } else {
          let offers = JSON.parse(res.data)
          setFetching(false)
          setOffers(offers)
        }
      })
    }, [selectedAssociation]);

  const standaloneCard = <>
      <Center>
          <Box className="tw-rounded-xl tw-shadow-lg tw-relative">
              <Image
                  className="tw-absolute tw-z-20 tw-right-1 tw-opacity-80 -tw-translate-y-1/2 tw-top-1/2"
                  width={24}
                  height={24}
                  src={`/sim.png`}
                  alt="logo sim"
              />
              <Image
              className="tw-opacity-95"
              radius={'lg'}
              width={200}
              height={110}
              src={`/uploads/${props.card.image?.name}`}
              alt="Photo de campagne"
              withPlaceholder
              />
          </Box>
      </Center>
      </>

    const OfferRow = ({offer}) => (
      <Card className='tw-flex tw-bg-gray-200 tw-mb-2' radius={'lg'}>
        <Center>
          <Avatar className='tw-shadow-md' radius={'lg'} src={`/uploads/${offer.enseigne?.avatar?.name}`} />
        </Center>
        <Flex direction={'column'} className='tw-flex-1 tw-px-3'>
          <Flex justify={'space-between'}>
            <Text weight={550}>{offer.association.description} <SponsoringOfferTypeBadge offer={offer} /></Text>
            <Text className='tw-flex tw-font-light' fz={'sm'}>
              <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />{offer.association.ville}</Text>
          </Flex>
          <Text color='dimmed'>{offer.description}</Text>
        </Flex>
      </Card>
    )

    const offersList = <>
      <Transition mounted={setShowOffers} transition="slide-down" duration={400} timingFunction="ease">
        {(styles) => 
          <section style={styles} className='tw-mt-1'>
            {offers.map((offer) => (
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
        
        <Box className='tw-min-h-[calc(100vh-180px)]'>
            <Box className='tw-relative'>
              <Center className='tw-absolute tw-left-2 tw-top-0.5'>
                <PreviousPageButton href='/' className='tw-z-20' />
              </Center>
            </Box>
            
            <Box className='tw-min-h-full'>
                <section className="tw-mt-6 tw-mx-2">
                <Box className="tw-relative tw-z-[1]">
                    {standaloneCard}
                </Box>
                <Box className="tw-h-full tw-bg-gradient-to-br tw-from-slate-100 tw-to-gray-100 tw-shadow-lg tw-rounded-2xl tw-pt-4 tw-relative tw-mt-4 tw-z-0" p={'md'}>
                    <Title order={3} mb={'sm'} align="center">J&lsquo;adhère à Pace&lsquo;Sport</Title>

                    <Container className='tw-border-2 tw-rounded-md tw-shadow-sm tw-border-red-500 tw-p-4'>
                        <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
                            <Title align='center' order={6}>Pace&lsquo;Sport</Title>
                            <Select
                                label={
                                    <Flex className='tw-mb-2'>
                                        <Center>
                                            <Badge className='tw-bg-red-500 tw-px-2 tw-max-h-4 tw-max-w-4 tw-rounded-full'></Badge>
                                        </Center>
                                        <Text ml={'md'} fz={'lg'}>14.99€/An</Text>
                                        </Flex>
                                }
                                placeholder="Association"
                                rightSection={<AiOutlineSync size={14} />}
                                rightSectionWidth={30}
                                styles={{ rightSection: { pointerEvents: 'none' } }}
                                data={associationsSelect}
                                value={selectedAssociation ? selectedAssociation.label : null}
                                onChange={selectedAssociationHandler}/>
                            <Center>
                                <Button type='submit' color='red' variant='filled' mt={"md"} radius={'lg'} px={'xl'} size='sm'
                                     className='tw-bg-red-600/90 tw-shadow-sm'>
                                    Souscrire</Button>
                            </Center>
                        </form>
                    </Container>

                    <Title order={6} my={'lg'} align='center'>Les offres</Title>
                    {fetching && 
                     <Center>
                      <Loader />
                     </Center>
                    }
                    {offers.length == 0 
                      ? fetching 
                        ? <></>
                        : <Text color='dimmed' align='center'>Aucune offre</Text>
                      : offersList
                    }
                    <Space my={'md'} />
                </Box>
                </section>
            </Box>
        </Box>

    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.query.id
  const token = context.req.cookies['token']
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

  let offers = await getActiveOffers(token)

  // // Pass data to the page via props
  return { props: {
    avatar: avatar.filename,
    associations: JSON.parse(associations.data),
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