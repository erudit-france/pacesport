import Head from 'next/head'
import { Avatar, Badge, Box, Button, Card, Center, Container, Flex, Grid, Group, Image, Loader, Modal, Paper, Select, Space, Text, Title, Transition } from '@mantine/core'
import Layout from '../../../../layout'
import { BsArrowLeft } from "react-icons/bs";
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import Link from "next/link";
import * as cookie from 'cookie'
import { useRouter } from 'next/router'

import { getActiveOffers } from '@/domain/repository/CardOffersRepository'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { AiOutlineSync } from 'react-icons/ai'
import { useForm } from '@mantine/form'
import SponsoringOfferTypeBadge from '@/components/SponsoringOfferTypeBadge'
import Toast from '@/services/Toast'
import { getPacesportCard } from '@/domain/repository/PacesportRepository'
import { getAssociationActiveOffers } from '@/domain/repository/SponsoringOfferRepository'
import { getById } from '@/domain/repository/AssociationRepository'
import { serialize } from 'object-to-formdata'
import { getActiveSubscription } from '@/domain/repository/OrderRepository'


export default function Page(props) {
  const [loading, setLoading] = useState(false)
  const [offers, setOffers] = useState(props.associationActiveOffers)
  const { push } = useRouter()
  const [showOffers, setShowOffers] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [selectedAssociation, setSelectedAssociation] = useState(null)
  const [association, setAssociation] = useState(props.association)
  const router = useRouter()
  const refresh = () => { router.reload(window.location.pathname) }
  const selectedAssociationHandler = (association) => {
    setSelectedAssociation(association)
  }
  const associationsSelect = props.associations.map((association) => (
    { label: association.name, value: association.id }
  ))
  const form = useForm({
    initialValues: {
      association: props.id,
    },
    validate: {
      // association: (value) => {

      //   // if (selectedAssociation != null ) {
      //   //   return null
      //   // } else {
      //   //   return 'Veuillez saisir choisir une association'
      //   // }
      // },
    },
  });

  const submitHandler = (values) => {
    // console.log(server);
    const baseURL = window.location.href;

    fetch(`/api/stripe/subscriptionLinks`, {
      method: 'POST',
      headers: new Headers({
        'JWTAuthorization': `Bearer ${getCookie('token')}`
      }),
      body: JSON.stringify({
        cancelUrl: baseURL,
        baseUrl: baseURL,
        asso: association.id,
      })
    }).then(res => res.json())
      .then(res => {
        console.log("Error from server:", res);
        if (res.yearUrl) {
          router.push(res.yearUrl)
        }
      })
      .catch((err) => {
        console.error("Error from server:", err);
        Toast.error('Erreur, veuillez réessayer plus tard');
      })

  }

  useEffect(() => {
    if (selectedAssociation == null) {
      return
    }
    console.log('selectedAssociation', selectedAssociation)
    setFetching(true)
    setOffers([])
    fetch(`/api/sponsoring-offer-sponsor-active/${selectedAssociation}`, {
      headers: new Headers({
        'JWTAuthorization': `Bearer ${getCookie('token')}`,
      })
    }
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

  const pacesportCardSrc = props.pacesportCard?.image?.name ? `/uploads/${props.pacesportCard?.image?.name}` : '/logo.png'
  const standaloneCard = <>
    <Center>
      <Box className="tw-rounded-xl tw-shadow-lg tw-relative">
        <Image
          className="tw-rounded-xl tw-absolute tw-left-5 tw-z-10 tw-opacity-80 -tw-translate-y-full tw-top-10"
          width={24}
          height={24}
          src={`/uploads/${association.avatar?.name}`}
          alt="logo sim"
        />
        <Image
          className="tw-opacity-95 tw-rounded-xl"
          radius={'lg'}
          width={200}
          height={110}
          src={`${pacesportCardSrc}`}
          alt="Photo de campagne"
          withPlaceholder
        />
      </Box>
    </Center>
  </>

  const OfferRow = ({ offer }) => (
    <Card className='tw-flex tw-bg-gray-200 tw-mb-2' radius={'lg'}>
      <Center>
        <Avatar className='tw-shadow-md' radius={'lg'} src={`/uploads/${offer.enseigne?.avatar?.name}`} />
      </Center>
      <Flex direction={'column'} className='tw-flex-1 tw-px-3'>
        <Flex justify={'space-between'}>
          <Text weight={550}>{offer.enseigne.name} <SponsoringOfferTypeBadge offer={offer} /></Text>
          {/* <Text className='tw-flex tw-font-light' fz={'sm'}> */}
          {/* <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />{offer.association.ville}</Text> */}
        </Flex>
        <Text color=''>{offer.titre}</Text>
        <Text color='dimmed'>{offer.description}</Text>
      </Flex>
    </Card>
  )

  const filteredOffers = offers.filter(
    offer =>
      (offer.type === "Nationale" || (offer.type === "Locale" && offer.id === props.id))
  );
  console.log(filteredOffers)

  const offersList = <>
    <Transition mounted={setShowOffers} transition="slide-down" duration={400} timingFunction="ease">
      {(styles) =>
        <section style={styles} className='tw-mt-1'>
          {filteredOffers.map((offer) => (
            <OfferRow key={offer.title} offer={offer} />
          ))}
        </section>}
    </Transition>
  </>


  return (
    <>
      <Head>
        <title>PACE'SPORT</title>
        <meta name="description" content="PACE'SPORT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box className='tw-min-h-[calc(100vh-180px)]'>
        <Box className='tw-relative'>

        </Box>

        <Box className='tw-min-h-full'>
          <section className="tw-mt-6 tw-mx-2">
            <Box className="tw-relative tw-z-[1]">
              {standaloneCard}
              <Center className='tw-absolute tw-left-2 tw-top-0.5'>
          <Link href="/">
            <Button variant="filled" size="sm"
              className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full"
              radius={'xl'}><BsArrowLeft /></Button></Link>
          </Center>
            </Box>
            <Box className="tw-h-full tw-bg-gradient-to-br tw-from-slate-100 tw-to-gray-100 tw-shadow-lg tw-rounded-2xl tw-pt-4 tw-relative tw-mt-4 tw-z-0" p={'md'}>
              <Title order={3} mb={'sm'} align="center">J'adhère à Pace'Sport</Title>

              <Container className='tw-border-2 tw-rounded-md tw-shadow-sm tw-border-[#d61515] tw-p-4'>
                <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
                  <Title align='center' order={6}>Pace'Sport</Title>
                  {/* <Select
                                label={
                                    <Flex className='tw-mb-2'>
                                        <Center>
                                            <Badge className='tw-bg-[#d61515] tw-px-2 tw-max-h-4 tw-max-w-4 tw-rounded-full'></Badge>
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
                                onChange={selectedAssociationHandler}/> */}

                  <Group>
                    <Avatar className="tw-shadow-md" size={'lg'} radius={'xl'} src={`/uploads/${association.avatar?.name}`} />
                    <Text fz={'md'} weight={600}>{association.name}</Text>
                  </Group>
                  <Center>
                    <Button type='submit' color='red' variant='filled' mt={"md"} radius={'lg'} px={'xl'} size='sm'
                      className='tw-bg-[#d61515] tw-shadow-sm'
                      disabled={loading}>
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
      <script dangerouslySetInnerHTML={{
        __html: `
            // Attacher un gestionnaire d'événements au bouton
            document.getElementById('goBackButton').addEventListener('click', function() {
                // Appeler la fonction pour revenir en arrière dans l'historique
                window.history.back();
            });
        `}} />
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.query.id
  const token = context.req.cookies['token']
  let avatar = await fetch(`${process.env.API_URL}/api/user/avatar`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  if (avatar.code == 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }
  }

  let pacesportSubscription = await getActiveSubscription(token)
  if (!(pacesportSubscription.data === 'null' || pacesportSubscription.data == null)) {
    return {
      redirect: {
        permanent: false,
        destination: `/profil/particulier/carte`
      }
    }
  }
  avatar = await avatar.json();
  // fetch Associations
  let associations = await fetch(`${process.env.API_URL}/api/association/list`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  associations = await associations.json();

  let offers = await getActiveOffers(token)
  let pacesport = await getPacesportCard(token)
  let associationActiveOffers = await getAssociationActiveOffers(token, id)
  let association = await getById(token, id)


  // // Pass data to the page via props
  return {
    props: {
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
      offers: JSON.parse(offers.data),
      pacesportCard: JSON.parse(pacesport.data),
      associationActiveOffers: JSON.parse(associationActiveOffers.data),
      association: JSON.parse(association.data),
      id: id
    }
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout avatar={null}>{page}</Layout>
  )
}