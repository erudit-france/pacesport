import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { Avatar, Box, Button, Card, Center, Container, Flex, Grid, Group, Image, Modal, Paper, Space, Text, Title, Transition } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import Layout from '../../../layout'
import { getAssociationActiveOffers } from '@/domain/repository/SponsoringOfferRepository'
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import * as cookie from 'cookie'
import { useRouter } from 'next/router'
import OrganisationCard from '@/components/OrganisationCard'
import OrganisationCardParticulier from '@/components/OrganisationCardParticulier'
import AssociationCardParticulier from '@/components/AssociationCardParticulier'
import CommunicationAdsCarousel from '@/components/CommunicationAdsCarousel'
import moment from 'moment'
import { getActiveOffers } from '@/domain/repository/CardOffersRepository'
import { FaMapMarkerAlt } from 'react-icons/fa'
import SponsoringOfferTypeBadge from '@/components/SponsoringOfferTypeBadge'
import ReactCardFlip from 'react-card-flip'
import { getUser } from '@/domain/repository/UserRepository'
import { getPacesportCard } from '@/domain/repository/PacesportRepository'
import { getActiveSubscription } from '@/domain/repository/OrderRepository'


export default function Page(props) {
  const [pacesportSubscription, setPacesportSubscription] = useState(props.pacesportSubscription)
  const [showOffers, setShowOffers] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [stap3, setStap3] = useState(null)
  const [stap2, setStap2] = useState(null)
  const [showBoxList, setShowBoxList] = useState(false);
  const [filteredOffersNearby, setFilteredOffersNearby] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [error, setError] = useState(null);
  const pacesportCardSrc = props.pacesportCard?.image?.name ? `/uploads/${props.pacesportCard?.image?.name}` : '/logo.png'
  const standaloneCard = <>
    <Center>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <Box className="tw-rounded-[17px] tw-border-[1px] tw-relative tw-border-zinc-900 tw-shadow-lg">
          <Image
            className="tw-rounded-xl tw-absolute tw-left-5 tw-z-10 tw-opacity-80 -tw-translate-y-full tw-top-10"
            width={36}
            height={36}
            src={`/uploads/${pacesportSubscription.association.avatar?.name}`}
            alt="logo sim"
          />
          <Image
            className="tw-rounded-xl"
            radius={'lg'}
            width={280}
            height={160}
            src={`${pacesportCardSrc}`}
            alt="Photo de campagne"
            withPlaceholder
          />
        </Box>

        <Box className="tw-shadow-lg tw-border-[1px] tw-border-zinc-900 tw-relative tw-h-[160px] tw-w-[280px] tw-rounded-2xl tw-overflow-hidden">
          <Box className='tw-bg-gray-200/60 tw-w-full tw-h-full tw-absolute tw-top-0 tw-left-0' style={{ backgroundImage: 'url(/Design_carte_dos.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}></Box>
          <Box className='tw-relative tw-h-full tw-rounded-lg' py={'lg'} my={'md'}>
            <Flex className="tw-h-full" direction={'column'} justify={'space-between'}>
              <Text px={'lg'} className='tw-bg-gray-600/60 text-white tw-py-1'>{props.user?.nom}{' '}{props.user?.prenom}</Text>
              <Text className="tw-text-gray-500" align="left" px={'lg'} mb={"md"} fz={'sm'}>Validé le {moment(props.pacesportSubscription.createdAt).format('DD/MM/YYYY')}</Text>
              <Text className="tw-text-gray-500" align="left" px={'lg'} mb={"md"} fz={'sm'}>Jusqu'au {moment(props.pacesportSubscription.createdAt).add(1, "year").format('DD/MM/YYYY')}</Text>
            </Flex>
          </Box>
        </Box>

      </ReactCardFlip>
    </Center>
  </>

  const OfferRow = ({ offer }) => (
    <Card className='tw-flex tw-bg-gray-50 tw-mb-2' radius={'lg'}>
      <Center>
        <Avatar className='tw-shadow-md' radius={'lg'} src={`/uploads/${offer?.enseigne?.avatar?.name}`} />
      </Center>
      <Flex direction={'column'} className='tw-flex-1 tw-px-3'>
        <Flex justify={'space-between'}>
          <Text weight={550}>{offer?.enseigne?.name} <SponsoringOfferTypeBadge offer={offer} /></Text>
          <Text className='tw-flex tw-font-light' fz={'sm'}>
            <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />{offer?.enseigne?.city}</Text>
        </Flex>
        <Text color='dimmed'>{offer?.description}</Text>
        <Text color='dimmed'>{offer?.title}</Text>
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

  useEffect(() => {
    // Obtenir la position actuelle
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const filteredOffersNearby2 = await Promise.all(
          filteredOffers.map(async (offer) => {
            const address = offer.enseigne.address;
            const osmGeocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURI(address)}`;
            try {
              const response = await fetch(osmGeocodingUrl);
              const data = await response.json();
              if (data.length > 0) {
                const { lat: offerLat, lon: offerLon } = data[0];
                const distance = calculateDistance(lat, lon, offerLat, offerLon);
                offer.title = `Distance : ${distance} meters`;
                console.log("okD" + distance);
                return distance <= 40000;
              } else {
                return false; // Coordonnées non trouvées
              }
            } catch (error) {
              console.error(`Error while fetching coordinates for address: ${address}`, error);
              return false;
            }
          })
        );

        // Filtrer les offres pour ne conserver que celles pour lesquelles la valeur retournée était true
        const filteredTrueOffers = filteredOffers.filter((_, index) => filteredOffersNearby2[index]);

        // Vous avez maintenant une liste d'offres pour lesquelles la valeur retournée était true
        setFilteredOffersNearby(filteredTrueOffers);
      },
      (error) => {
        setError(`Error while getting location: ${error.message}`);
      }
    );
  }, []);

  const toggleBoxList = () => {
    setIsFlipped(true);
    setShowBoxList(!showBoxList);
  };

  const toggleBoxList2 = () => {
    setIsFlipped(false);
    setStap2(null);
    setStap3(false);
  };

  const toggleBoxList3 = () => {
    setIsFlipped(true);
    setStap2(null);
  };

  const toggleConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => {
      setConfettiActive(false);
    }, 5000); // Désactivez les confettis après 5 secondes
  };

  const selectBox = (name) => {
    setShowBoxList(false);
    console.log("ttt")
    setStap2(name);
    console.log(name);
    console.log(stap2);
  };

  const filteredOffers = props.offers.filter(
    offer =>
      offer.type === "Nationale" ||
      (offer.type === "Locale" && offer.associations.some(ass => ass.id == props.id))
  );

  const Bit2 = <>
    <Box className='tw-relative' >
      <Center className='tw-absolute tw-left-2 tw-top-0.5'>
      </Center>

      <Flex justify="center">
        <Group position="center" className="">
          <Button
            size="md"
            onClick={toggleBoxList}
            className="tw-text-black tw-px-8 tw-py-3 tw-bg-gradient-to-br tw-from-gray-200 tw-to-white tw-shadow-md tw-w-full tw-rounded-2xl tw-border-2 tw-border-white hover:tw-bg-gray-200"
          >
            J'utilise ma carte
          </Button>
        </Group>
      </Flex></Box>
  </>

  const Bit = <>
    <Box className='tw-absolute truc-fonce' >
      <Center className='tw-absolute tw-left-2 tw-top-0.5'>
      </Center>

      <div className="overlay">
        <Group position="center" className="">
          <Button
            size="md"
            onClick={toggleBoxList2}
            className="tw-text-black tw-px-8 tw-py-3 tw-bg-gradient-to-br tw-from-gray-200 tw-to-white tw-shadow-md tw-w-full tw-rounded-2xl tw-border-2 tw-border-white hover:tw-bg-gray-200"
          >
            retour
          </Button>
        </Group>
        <br />
        {filteredOffersNearby.length === 0 ? (
          <Center><h2 className="tw-text-white">Aucune offre n'a été trouvée à proximité.</h2></Center>
        ) : (
          filteredOffersNearby.map((offer) => (
            <div key={offer.title} onClick={() => selectBox(offer)}>
              <OfferRow key={offer?.title} offer={offer} />
            </div>
          ))
        )}

      </div>
      {selectedBox && (
        <div>
          {/* Affichez le texte sélectionné ici */}
          Texte sélectionné : {selectedBox}
        </div>
      )}
    </Box>
  </>

  const ConfettiAnimation = () => {
    const [showConfetti, setShowConfetti] = useState(false);

    const startConfettiAnimation = () => {
      setShowConfetti(true);
      setIsFlipped(false);
      setStap3(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 4000); // Activer l'animation pendant 2 secondes (2000 millisecondes)
    };

    useEffect(() => {
      if (showConfetti) {
        const container = document.getElementById('confetti-container');
        const confettiColors = ['#f54291', '#2d95bf', '#f4cf42', '#42f474', '#f44242'];

        const createConfetti = () => {
          const confetti = document.createElement('div');
          confetti.style.width = '10px';
          confetti.style.height = '10px';
          confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
          confetti.style.position = 'absolute';
          confetti.style.left = `${Math.random() * 100}%`;
          confetti.style.animation = `fall 3s linear, spin 3s linear infinite`; // Ajout de l'animation de descente
          confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
          container.appendChild(confetti);
        };

        const intervalId = setInterval(createConfetti, 200);

        return () => {
          // Nettoyer les confettis et l'intervalle lorsque le composant est démonté
          container.innerHTML = '';
          clearInterval(intervalId);
        };
      }
    }, [showConfetti]);

    return (
      <div>
        <div id="confetti-container" style={{ width: '100%', position: 'relative' }}>
        </div>
        <Box className="tw-relative tw-z-[1]">
          {standaloneCard}
        </Box>
        <br />
        <Button
          size="md"
          onClick={startConfettiAnimation}
          className="tw-text-black tw-px-8 tw-py-3 tw-bg-gradient-to-br tw-from-gray-200 tw-to-green tw-shadow-md tw-w-full tw-rounded-2xl tw-border-2 tw-border-white hover:tw-bg-gray-200"
        >
          Valider mon pace'sport
        </Button>
      </div>
    );
  };

  const RatingButton = () => {
    const [rating, setRating] = useState(0);

    const handleRatingClick = (value) => {
      setRating(value);
    };

    return (
      <Card className='tw-flex tw-justify-center tw-bg-gray-50 tw-mb-2' radius={'lg'}>
        <Box>
          <Center> <Text color='black'>Notez votre transaction</Text></Center>
          <Group position="center" className="">
            <Center>
              <div className='tw-text-30'>
                <h2 className='tw-text-center'>{rating} étoiles</h2>
                <div>
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      onClick={() => handleRatingClick(starValue)}
                    >
                      {starValue <= rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
            </Center>
          </Group>
        </Box>
      </Card>
    );
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  return (
    <>
      <Head>
        <title>PACE'SPORT</title>
        <meta name="description" content="PACE'SPORT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>

        {stap3 ? (<Box className='tw-absolute truc-fonce' >
          <Card className='tw-flex tw-bg-gray-50 tw-mb-2' radius={'lg'}>
            <Flex direction={'column'} className='tw-flex-1 tw-px-3'>
              <Center> <h1 color='black' className='tw-text-center'>Félicitation, PACE'SPORT validé !</h1></Center>
              <br />
              <Center> <Text color='black'>Vous avez collecté 100 points !</Text></Center>
              <br />
              {/* <Text color='dimmed'>{stap2}</Text> */}
            </Flex>
          </Card>

          <br />
          <RatingButton />
          <br />
          <Group position="center" className="">
            <Button
              size="md"
              onClick={toggleBoxList2}
              className="tw-text-black tw-px-8 tw-py-3 tw-bg-gradient-to-br tw-from-gray-200 tw-to-white tw-shadow-md tw-w-full tw-rounded-2xl tw-border-2 tw-border-white hover:tw-bg-gray-200"
            >
              retour
            </Button>
          </Group></Box>) : (
          stap2 ? (<Box className='tw-absolute truc-fonce' >
            <Group position="center" className="">
              <Button
                size="md"
                onClick={toggleBoxList3}
                className="tw-text-black tw-px-8 tw-py-3 tw-bg-gradient-to-br tw-from-gray-200 tw-to-white tw-shadow-md tw-w-full tw-rounded-2xl tw-border-2 tw-border-white hover:tw-bg-gray-200"
              >
                retour
              </Button>
            </Group>
            <br />
            <Card className='tw-flex tw-bg-gray-50 tw-mb-2' radius={'lg'}>
              <Flex direction={'column'} className='tw-flex-1 tw-px-3'>
                <Center> <Text color='black'>{stap2.enseigne.name}</Text></Center>
                <Center> <Text color='black'>{stap2.description}</Text></Center>
                <Center><Text color='black'>{stap2.title}</Text></Center>
                <br />
                {/* <Text color='dimmed'>{stap2}</Text> */}
                <ConfettiAnimation />
              </Flex>
            </Card></Box>) : (
            isFlipped ? (
              Bit
            ) : (
              Bit2
            )
          ))}

        <Box>
          <Container className="tw-mt-6">
            <Box className="tw-relative tw-z-[1]">
              {standaloneCard}
            </Box>
            <Box className="tw-bg-gradient-to-br tw-from-slate-100 tw-to-gray-100 tw-shadow-lg tw-rounded-2xl tw-pt-12 tw-relative -tw-top-10 tw-z-0" p={'md'}>
              <Title order={3} mb={'sm'} align="center">Pace'Sport</Title>
              {pacesportSubscription &&
                <Center>
                  <Group>
                    <Avatar className="tw-shadow-md" size={'lg'} radius={'xl'} src={`/uploads/${pacesportSubscription.association.avatar?.name}`} />
                    <Text fz={'md'} weight={600}>{pacesportSubscription.association.name}</Text>
                  </Group>
                </Center>
              }

              <Text className="tw-text-gray-800" align="center" mt={'sm'} fz={'sm'}>Abonné jusqu'au {moment(pacesportSubscription.createdAt).add(1, 'years').format('DD/MM/YYYY')}</Text>
              <Center mt={'md'}>
                <Button onClick={() => setShowOffers(!showOffers)} color='white' variant='outline' className='tw-border-gray-700' radius={'lg'}>
                  <Text className='tw-text-gray-800' transform='uppercase' fz={'sm'}>Voir {showOffers ? 'moins' : 'les offres'}</Text>
                </Button>
                {/* <Text className="tw-border-[1px] tw-px-8 tw-py-0.5 tw-border-green-500 tw-bg-green-400 tw-text-gray-50 tw-rounded-xl tw-shadow-md">Possédée</Text> */}
              </Center>
            </Box>
            {showOffers &&
              <section className='tw-relative -tw-top-6'>
                {filteredOffers.map((offer) => (
                  <OfferRow key={offer.title} offer={offer} />
                ))}
                <br /><br /><br />
              </section>
            }
            {/* <Center className="">
            <Box className="tw-bg-gradient-to-br tw-fixed tw-from-slate-100 tw-h-30 tw-w-[95%] tw-to-gray-100 tw-bottom-1 tw-shadow-xl tw-rounded-2xl" p={'md'}>
            <Group><Avatar className="tw-shadow-md" size={'md'} radius={'xl'} src={`/uploads/${props.user.enseigne.avatar?.name}`} />
              <Text order={3} mb={'sm'} align="center">{props.user.enseigne.name}</Text></Group>
              <Text className="tw-text-gray-800" align="center" mt={'sm'} fz={'sm'}>Message publicitaire exemple</Text>
              </Box>
            </Center> */}
          </Container>
        </Box>
      </Container>

    </>
  )
}

export async function getServerSideProps(context) {
  const token = context.req.cookies['token_v2']
  let avatar = await fetch(`${process.env.API_URL}/api/user/avatar`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  avatar = await avatar.json();

  let offers = await getActiveOffers(token)
  let user = await getUser(token)
  if (user.code == 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }
  }
  //pacesportSubscription.id
  let pacesport = await getPacesportCard(token)
  let pacesportSubscription = await getActiveSubscription(token)
  pacesportSubscription = JSON.parse(pacesportSubscription.data)
  let id = pacesportSubscription.association.id
  let associationActiveOffers = await getAssociationActiveOffers(token, id)

  if (user.data == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }

  // Pas d'abonnement, redirection
  if (pacesportSubscription == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }
  let subscriptionActiveOffers = JSON.parse(associationActiveOffers.data)


  // // Pass data to the page via props
  return {
    props: {
      avatar: avatar.filename,
      user: JSON.parse(user.data),
      card: {
        image: {
          name: null
        },
        startDate: Date.now(),
        endDate: Date.now(),
        price: 11.99
      },
      offers: subscriptionActiveOffers,
      pacesportCard: JSON.parse(pacesport.data),
      pacesportSubscription: pacesportSubscription,
      id: id
    }
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout avatar={null}>{page}</Layout>
  )
}