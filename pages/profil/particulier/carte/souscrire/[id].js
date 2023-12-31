import Head from 'next/head'
import { Avatar, Badge, Box, Button, Card, Center, Container, Flex, Grid, Group, Image, Loader, Modal, Paper, Select, Space, Stack, Text, Title, Transition } from '@mantine/core'
import Layout from '../../../../layout'
import { BsArrowLeft } from "react-icons/bs";
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import Link from "next/link";
import * as cookie from 'cookie'
import axios from "axios";
import { useRouter } from 'next/router'
import moment from 'moment';
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
import { getUser } from '@/domain/repository/UserRepository';
import OfferDescriptionCard from '@/components/OfferDescriptionCard';


export default function Page(props) {
  const [loading, setLoading] = useState(false)
  const [offers, setOffers] = useState(props.associationActiveOffers)
  const { push } = useRouter()
  const [champ, setChamp] = useState('');
  let filteredOffersOld = null
  const [showOffers, setShowOffers] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [selectedAssociation, setSelectedAssociation] = useState(null)
  const [association, setAssociation] = useState(props.association)
  const subscriptionPrice = 14.99
  const [iframeUrl, setIframeUrl] = useState(null)
  const [opened, setOpened] = useState(false)
  const [isActive, setIsActive] = useState(props.pacesportCard?.isActif || false);

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

  const closeModalHandler = () => {
    setOpened(false)
    setIframeUrl(null)
  }

  const mailFacture = () => {
    const data = {
      email: props?.user?.email
  };
  console.log("jjjjjjjjjjjjjjjjjjjjjjjjj"+props?.user?.email)
    fetch(`/api/mail/sendFacture`, {
        method: 'POST',
        headers: new Headers({
            'JWTAuthorization': `Bearer ${getCookie('token_v2')}`
        }),
        body: JSON.stringify(data) 
    }).then(res => res.json())
        .then(res => {
            if (res.data) {
                Toast.success('Mail envoyée')
            }
            close()
        })
        .catch((error) => {
            close()
        })
};

  const submitHandler = (values) => {

    const cancelUrl = window.location.href;
    const baseURL = window.location.protocol + '//' + window.location.host;
    // setOpened(true)
    // setIframeUrl(`/api/payment/generate?orderType=subscription&association=${props.id}&ref=${props.user.id}&baseurl=${props.baseUrl}&XDEBUG_SESSION_START=tom`)
    // return

    fetch(`/api/stripe/subscriptionLinks`, {
      method: 'POST',
      headers: new Headers({
        'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
      }),
      body: JSON.stringify({
        cancelUrl: cancelUrl,
        baseUrl: baseURL,
        asso: association.id,
      })
    }).then(res => res.json())
      .then(res => {
        //mailFacture()
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

    setFetching(true)
    setOffers([])
    fetch(`/api/sponsoring-offer-sponsor-active/${selectedAssociation}`, {
      headers: new Headers({
        'JWTAuthorization': `Bearer ${getCookie('token_v3')}`,
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

  const requestLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Ici, vous devrez faire appel à une API ou un service pour obtenir le code postal
        // basé sur les coordonnées. Par exemple, en utilisant une API comme OpenStreetMap, Mapbox, etc.

        const codePostal = await fetchYourGeocodingAPI(lat, lon);
        filteredOffers = filteredOffersOld.filter(
          offer => offer.association?.postal.substring(0, 2) === codePostal?.postcode.substring(0, 2))

      }, (error) => {
        const codePostal = "69011"
        filteredOffers = filteredOffersOld.filter(
          offer => offer.association?.postal && offer.association?.postal.substring(0, 2) === codePostal.substring(0, 2))
      });
    } else {
      alert("La géolocalisation n'est pas prise en charge par ce navigateur.");
    }
  }

  const fetchYourGeocodingAPI = async (lat, lon) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const address = response.data.address;

      return address.postcode;
    } catch (error) {
      console.error("Error fetching geocode:", error);
      return null;
    }
  }

  let filteredOffers = offers.filter(
    offer =>
      (offer.type === "Nationale" ||
        (offer.type === "Locale" && offer.associations.some(ass => ass.id == props.id))) && offer.validated === true
  );

  const offersList = <>
    {filteredOffers.map((offer) => (
      <OfferDescriptionCard key={offer.title} offer={offer} />
    ))}
  </>
  filteredOffersOld = filteredOffers
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
                    className="tw-bg-gray-50 tw-text-black tw-ml-5 tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full"
                    radius={'xl'}><BsArrowLeft /></Button></Link>
              </Center>
            </Box>
            <Box className="tw-h-full tw-bg-gradient-to-br tw-from-slate-100 tw-to-gray-100 tw-shadow-lg tw-rounded-2xl tw-pt-4 tw-relative tw-mt-4 tw-z-0" p={'md'}>
              <Title order={3} mb={'sm'} align="center">J'adhère à Pace'Sport</Title>
              <Container className='tw-border-2 tw-rounded-md tw-shadow-sm tw-border-[#d61515] tw-p-4'>
                <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
                  <Title align='center' order={6}>Pace'Sport</Title>
                  {
                    /* <Select
                        label={
                            <Flex className='tw-mb-2'>
                                <Center>
                                    <Badge className='tw-bg-[#d61515] tw-px-2 tw-max-h-4 tw-max-w-4 tw-rounded-full'></Badge>
                                </Center>
                                <Text ml={'md'} fz={'sm'}>Choisir une association à soutenir - {subscriptionPrice}€/An</Text>
                                </Flex>
                        }
                        placeholder="Association"
                        rightSection={<AiOutlineSync size={14} />}
                        rightSectionWidth={30}
                        styles={{ rightSection: { pointerEvents: 'none' } }}
                        data={associationsSelect}
                        value={selectedAssociation ? selectedAssociation.label : null}
                        onChange={selectedAssociationHandler}/> */
                  }

                  {/* logo association - valide 1 an? */}
                  <Group>
                    <Avatar className="tw-shadow-md" size={'lg'} radius={'xl'} src={`/uploads/${association.avatar?.name}`} />
                    <Flex direction={'column'} justify={'center'}>
                      <Text fz={'md'} weight={600}>{association.name}</Text>
                      <Text fz={'sm'} weight={400} className='tw-text-gray-600'> Valide jusqu'au 30 juin 2024</Text>
                    </Flex>
                  </Group>
                  <Center>
                    {
                      isActive
                        ? (
                          <Button
                            type='submit'
                            color='red'
                            variant='filled'
                            mt={"md"}
                            radius={'lg'}
                            px={'xl'}
                            size='sm'
                            className='tw-bg-[#d61515] tw-shadow-sm'
                            disabled={loading}
                          >
                            Souscrire
                          </Button>
                        )
                        : <Text fz={'md'} weight={600}>Pace’sport arrive bientôt !</Text>
                    }

                  </Center>
                </form>

                <div className='tw-mt-10'>

                </div>
                <div className="tw-flex tw-justify-center tw-items-center tw-h-screen">
                  <div className="tw-flex tw-items-center">
                    <input
                      type="text"
                      id="champValider"
                      value={champ}
                      onChange={(e) => setChamp(e.target.value)}
                      className="tw-w-[40vw] tw-px-4 tw-py-2 tw-border tw-rounded-lg tw-text-md"
                      placeholder="Code promo"
                    />
                    <button
                      type="submit"
                      className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-ml-2 tw-rounded-lg tw-shadow-sm"
                      disabled={loading}
                    >
                      Valider
                    </button>
                  </div>
                </div>


              </Container>

              <Title order={6} my={'lg'} align='center'>Les offres</Title> <Button className='tw-text-black' onClick={requestLocation}>Filtrer avec ma position <FaMapMarkerAlt className='tw-relative tw-top-1 tw-ml-3 tw-mb-2 tw-text-gray-800' /></Button>
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
            <Center className='tw-absolute tw-top-20 tw-right-1'>
              <Link href="/contact" className="tw-flex tw-items-center tw-justify-center tw-h-screen">
                <Button variant="filled" size="sm"
                  className="tw-bg-gray-50 tw-text-black hover:tw-bg-red-100 hover:tw-text-black tw-rounded-full"
                  radius={'xl'}>Besoin d'aide</Button>
              </Link>
            </Center>
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

      <Modal
        opened={opened}
        onClose={closeModalHandler}
        title={<Title order={5}>Adhérer à Pace'sport</Title>}
      >
        <Group grow>
          <Text fw={600} fz={'sm'}>Abonnement</Text>
          <Text>1 An</Text>
        </Group>
        <Group grow>
          <Text fw={600} fz={'sm'}>Prix</Text>
          <Text>{subscriptionPrice} €</Text>
        </Group>
        <Center mt={'lg'}>
          <iframe className="tw-w-full" height={600} src={iframeUrl}></iframe>
        </Center>
      </Modal>
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.query.id
  const token = context.req.cookies['token_v3']
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

  let user = await getUser(token)

  if (user.code == 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }
  }

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
      id: id,
      user: JSON.parse(user.data),
      baseUrl: `${process.env.NEXT_URL}`,
    }
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout avatar={null}>{page}</Layout>
  )
}