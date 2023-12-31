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
import { FaAt, FaMapMarkerAlt } from 'react-icons/fa'
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
  const [filteredOffersNearby2, setFilteredOffersNearby2] = useState(filteredOffersNearby);
  const [filteredOffersNearby3, setFilteredOffersNearby3] = useState([]);
  const [filteredOffers3, setFilteredOffers3] = useState([]);
  const [searchResults, setSearchResults] = useState(filteredOffers3);
  const [selectedBox, setSelectedBox] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const pacesportCardSrc = props.pacesportCard?.image?.name ? `/uploads/${props.pacesportCard?.image?.name}` : '/logo.png'
  const [associationPartenaire, setAssociationPartenaire] = useState(false);
  const standaloneCard = <>
    <Center>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <Box className="tw-rounded-[17px] tw-border-[1px] tw-relative tw-border-zinc-900 tw-shadow-lg">
          {/* <Image
            className="tw-rounded-xl tw-absolute tw-left-5 tw-z-10 tw-opacity-80 -tw-translate-y-full tw-top-10"
            width={36}
            height={36}
            src={`/uploads/${pacesportSubscription.association.avatar?.name}`}
            alt="logo sim"
          /> */}
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

  const OfferRow555 = (ss) => (
    filteredOffersNearby3.sort(compareOffers).map((offer) => (
      <div key={offer.title} onClick={() => selectBox(offer)}>
        <Card className='tw-flex tw-bg-gray-200 tw-mb-2' radius={'lg'}>
          <Center>
            <Avatar className='tw-shadow-md' radius={'lg'} src={`/uploads/${offer.enseigne?.avatar?.name}`} />
          </Center>
          <Flex direction={'column'} className='tw-flex-1'>
            <Flex justify={'space-between'}>
              <Text weight={550}>{offer?.enseigne.name} <SponsoringOfferTypeBadge offer={offer} /></Text>
              <Text className='tw-flex tw-font-light' fz={'sm'}>
                {offer?.title === "online" ? (
                  // Si offer.title est "online", affiche uniquement l'icône FaMapMarkerAlt
                  <FaAt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />
                ) : (
                  // Sinon, affiche l'icône FaMapMarkerAlt suivi de l'attribut offer.enseigne.ville si celui-ci est défini
                  <>
                    <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />
                    {offer.enseigne && offer.enseigne.ville ? offer.enseigne.ville : null}
                  </>
                )}
              </Text>

            </Flex>
            <Text color='dimmed'>{offer.description}</Text>
            <Text color='dimmed'>{offer?.title != 'aucun' && offer?.title != null ? (offer?.title == "online" ? "Boutique en ligne" : ("Distance : " + (parseInt(offer?.title) > 1000 ? (offer?.title / 1000).toFixed(0) : offer?.title) + " " + (parseInt(offer?.title) > 1000 ? "km" : "mètres"))) : ''}</Text>
          </Flex>
        </Card>
      </div>
    ))
  )

  const OfferRow = ({ offer }) => (
    <Card className='tw-flex tw-bg-gray-200 tw-mb-2' radius={'lg'}>
      <Center>
        <Avatar className='tw-shadow-md' radius={'lg'} src={`/uploads/${offer.enseigne?.avatar?.name}`} />
      </Center>
      <Flex direction={'column'} className='tw-flex-1'>
        <Flex justify={'space-between'}>
          <Text weight={550}>{offer?.enseigne.name} <SponsoringOfferTypeBadge offer={offer} /></Text>
          <Text className='tw-flex tw-font-light' fz={'sm'}>
            {offer?.title === "online" ? (
              // Si offer.title est "online", affiche uniquement l'icône FaMapMarkerAlt
              <FaAt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />
            ) : (
              // Sinon, affiche l'icône FaMapMarkerAlt suivi de l'attribut offer.enseigne.ville si celui-ci est défini
              <>
                <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />
                {offer.enseigne && offer.enseigne.ville ? offer.enseigne.ville : null}
              </>
            )}
          </Text>

        </Flex>
        <Text color='dimmed'>{offer.description}</Text>
        <Text color='dimmed'>{offer?.title != 'aucun' && offer?.title != null ? (offer?.title == "online" ? "Boutique en ligne" : ("Distance : " + (parseInt(offer?.title) > 1000 ? (offer?.title / 1000).toFixed(0) : offer?.title) + " " + (parseInt(offer?.title) > 1000 ? "km" : "mètres"))) : ''}</Text>
      </Flex>
    </Card>
  )

  const OfferRow21 = (searchResultsT) => (
    searchResults.sort(compareOffers).map((offer) => (
      <Card className='tw-flex tw-bg-gray-200 tw-mb-2' radius={'lg'}>
        <Center>
          <Avatar className='tw-shadow-md' radius={'lg'} src={`/uploads/${offer.enseigne?.avatar?.name}`} />
        </Center>
        <Flex direction={'column'} className='tw-flex-1'>
          <Flex justify={'space-between'}>
            <Text weight={550}>{offer?.enseigne.name} <SponsoringOfferTypeBadge offer={offer} /></Text>
            <Text className='tw-flex tw-font-light' fz={'sm'}>
              {offer?.title === "online" ? (
                // Si offer.title est "online", affiche uniquement l'icône FaMapMarkerAlt
                <FaAt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />
              ) : (
                // Sinon, affiche l'icône FaMapMarkerAlt suivi de l'attribut offer.enseigne.ville si celui-ci est défini
                <>
                  <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />
                  {offer.enseigne && offer.enseigne.ville ? offer.enseigne.ville : null}
                </>
              )}
            </Text>

          </Flex>
          <Text color='dimmed'>{offer.description}</Text>
          <Text color='dimmed'>{offer?.title != 'aucun' && offer?.title != null ? (offer?.title == "online" ? "Boutique en ligne" : ("Distance : " + (parseInt(offer?.title) > 1000 ? (offer?.title / 1000).toFixed(0) : offer?.title) + " " + (parseInt(offer?.title) > 1000 ? "km" : "mètres"))) : ''}</Text>
        </Flex>
      </Card>
    ))
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

  const handleSearch = (text) => {
    setSearchText(text);
    let filtered = filteredOffersNearby2;
    if (text) {
      // Effectuez la recherche et filtrez les offres
      filtered = filtered.filter((offer) =>
        offer.enseigne.name.toLowerCase().includes(text.toLowerCase())
      );
    }
    // Mettez à jour l'état local des résultats de la recherche
    setFilteredOffersNearby3(filtered);
  }

  const handleSearch2 = (text) => {
    setSearchText(text);
    let filteredResults = filteredOffers3;
    if (text) {
      // Effectuez la recherche et filtrez les offres
      filteredResults = filteredOffers3.filter((offer) =>
        offer.enseigne.name.toLowerCase().includes(text.toLowerCase())
      );
    }
    console.log("pp" + text)
    // Mettez à jour l'état local des résultats de la recherche
    setSearchResults(filteredResults);
  };

  useEffect(() => {
    setFilteredOffers3(filteredOffers);
    setSearchResults(filteredOffers);
    setFilteredOffersNearby2(filteredOffers);
    setFilteredOffersNearby3(filteredOffers);
    // Obtenir la position actuelle
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const filteredOffersNearby2 = await Promise.all(
          filteredOffers.map(async (offer) => {
            try {
              console.log(offer.enseigne.latitude)
              if (offer.enseigne.latitude === "0" && offer.enseigne.longitude === "0") {
                offer.title = 'online'
                return true
              }
              else if (offer.enseigne.latitude === null && offer.enseigne.longitude === null) {
                offer.title = 'aucun'
                return false
              }
              else {
                const distance = calculateDistance(lat, lon, offer.enseigne.latitude, offer.enseigne.longitude);
                offer.title = `${(distance).toFixed(0)}`;
                return distance <= 500;
              }
            } catch (error) {
              return false;
            }
          })
        );

        // Filtrer les offres pour ne conserver que celles pour lesquelles la valeur retournée était true
        const filteredTrueOffers = filteredOffers.filter((_, index) => filteredOffersNearby2[index]);

        // Vous avez maintenant une liste d'offres pour lesquelles la valeur retournée était true
        setFilteredOffersNearby(filteredTrueOffers);
        setFilteredOffersNearby3(filteredTrueOffers);
      },
      (error) => {
        try {
          const filteredOffersNearby4 = filteredOffers.map((offer) => {
            if (offer.enseigne.latitude === "0" && offer.enseigne.longitude === "0") {
              offer.title = 'online';
              return true;
            } else {
              offer.title = 'aucun';
              return false;
            }
          });
          const filteredTrueOffers2 = filteredOffers.filter((_, index) => filteredOffersNearby4[index]);
          console.log(filteredTrueOffers2)
          setFilteredOffersNearby(filteredTrueOffers2);
          setFilteredOffersNearby2(filteredOffers);
          setFilteredOffersNearby3(filteredTrueOffers2);
        } catch (error) {
          // Gérer les erreurs
        }
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
    setAssociationPartenaire(name);
    setShowBoxList(false);
    console.log(name)
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
            className="tw-text-black tw-mt-10 tw-px-8 tw-py-3 tw-bg-gradient-to-br tw-from-gray-200 tw-to-white tw-shadow-md tw-w-full tw-rounded-2xl tw-border-2 tw-border-white hover:tw-bg-gray-200"
          >
            retour
          </Button>
        </Group>
        <Center>
          <input
            type="text"
            placeholder="Rechercher par enseigne..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="tw-bg-gray-100 tw-rounded-full tw-py-2 tw-px-4 tw-w-full tw-mt-4 tw-text-sm tw-focus:tw-outline-none tw-border tw-border-gray-300"
          />
        </Center>
        <br />
        {filteredOffersNearby3.sort(compareOffers).length === 0 ? (
          <Center><h2 className="tw-text-white">Aucune offre n'a été trouvée à proximité.</h2></Center>
        ) : (

          <OfferRow555 offer={filteredOffersNearby3} />
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

  const ConfettiAnimation = ({ associationPartenaire }) => {
    const [showConfetti, setShowConfetti] = useState(false);

    const startConfettiAnimation = async (associationPartenaire) => {
      // Je suppose que vous avez partenaire et association disponibles ici
      let partenaire = associationPartenaire.enseigne.id; // Mettez la valeur de 'partenaire' ici
      let association = associationPartenaire.associations[0].id; // Mettez la valeur de 'association' ici
      // Appel à l'API
      try {
        const response = await fetch(`/api/partenaire/user/association/${partenaire}/${association}/?XDEBUG_SESSION_START=tom`, {
          method: 'GET', // Ou POST, DELETE, etc., selon ce que vous voulez faire
          headers: {
            'Content-Type': 'application/json',
            'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
          }
        });
        const data = await response.json();
        // Utilisez la réponse ici si nécessaire
        console.log(data);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API: ", error);
        //Toast.error("Une erreur est survenue lors de l'appel à l'API."); // Ou un autre message d'erreur adapté à vos besoins
      }
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
          onClick={() => startConfettiAnimation(associationPartenaire)}
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
              <div className='tw-text-50'>
                <h2 className='tw-text-center'>{rating} étoiles</h2>
                <div>
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      onClick={() => handleRatingClick(starValue)}
                      style={{
                        fontSize: starValue <= rating ? '30px' : '30px',
                        color: starValue <= rating ? 'red' : 'black'
                      }}
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

  function compareOffers(offerA, offerB) {
    const titleA = offerA.title;
    const titleB = offerB.title;

    if (titleA === "online" && titleB === "online") {
      return 0; // Les deux sont "online", pas de changement d'ordre.
    }

    if (titleA === "online") {
      return -1; // L'élément avec titleA "online" doit aller en premier.
    }

    if (titleB === "online") {
      return 1; // L'élément avec titleB "online" doit aller en premier.
    }

    // Si aucun des deux n'est "online", comparez-les en tant que nombres.
    const numberA = titleA !== null ? parseInt(titleA, 10) : 0;
    const numberB = titleB !== null ? parseInt(titleB, 10) : 0;
    return numberA - numberB;
  }

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setImage(event.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    // Vous pouvez utiliser l'API de la caméra ici
    // Pour cet exemple, nous utiliserons une image de démonstration
    const demoImage = 'https://via.placeholder.com/150';
    setImage(demoImage);
  };

  const [image, setImage] = useState(null);

  // useEffect(() => {
  //   async function getCameraPermission() {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });

  //       if (stream) {
  //         // L'utilisateur a autorisé l'accès à la caméra
  //         // Vous pouvez maintenant afficher le flux vidéo en direct ou prendre une photo
  //       }
  //     } catch (error) {
  //       // Gérer les erreurs, par exemple, l'utilisateur a refusé l'accès à la caméra
  //       console.error('Erreur lors de la demande d\'accès à la caméra:', error);
  //     }
  //   }

  //   getCameraPermission();
  // }, []);

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
          <Card className='tw-flex tw-bg-gray-50 tw-mb-2 tw-mt-5' radius={'lg'}>
            <Flex direction={'column'} className='tw-flex-1'>
              <Center><h1 color='black' className='tw-text-center'>Félicitation, PACE'SPORT validé !</h1></Center>
              <Center>
                <Group>
                  <Avatar className="tw-shadow-md tw-z-20" size={'lg'} radius={'xl'} src={`/uploads/${pacesportSubscription.association.avatar?.name}`} />
                  <div className="heart-rate">
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="150px"
                      height="73px"
                      viewBox="0 0 150 73"
                      enableBackground="new 0 0 150 73"
                      xmlSpace="preserve"
                    >
                      <polyline
                        fill="none"
                        stroke="#000000"
                        strokeWidth="3"
                        strokeMiterlimit="10"
                        points="0,45.486 62.838,45.622 71.959,20 80.067,70.729 90.297,45.486 150,45.486"
                      />
                    </svg>
                    <div className="fade-in"></div>
                    <div className="fade-out"></div>
                  </div>
                  <Avatar className="tw-shadow-md tw-z-20" size={'lg'} radius={'xl'} src={`/uploads/${stap2.enseigne.avatar?.name}`} />
                </Group>
              </Center>
              <Center><Text fz={'md'} weight={600}>{pacesportSubscription.association.name} vous remercie pour votre achat chez {stap2.enseigne.name}</Text></Center>
              {/* <Text color='dimmed'>{stap2}</Text> */}
            </Flex>
          </Card>
          <RatingButton />
          <Card className='tw-flex tw-justify-center tw-bg-gray-50 tw-mb-2' radius={'lg'}>
            <Box>
              <Center> <Text color='black'>Envoyer mon reçu pour obtenir des points Pace'Sport</Text></Center>
              <br />
              <Group position="center" className="">
                <Center>
                  <div>
                    <input type="file" accept="image/*" onChange={handleUpload} />
                    {/* <button onClick={handleTakePhoto}>Prendre une photo</button>
                    {image && <img src={image} alt="Uploaded/Taken Photo" />} */}
                  </div>
                </Center>
              </Group>
            </Box>
          </Card>
          <Group position="center" className="">
            <Button
              size="md"
              onClick={toggleBoxList2}
              className="tw-text-black tw-px-8 tw-py-3 tw-bg-gradient-to-br tw-from-gray-200 tw-to-white tw-shadow-md tw-w-full tw-rounded-2xl tw-border-2 tw-border-white hover:tw-bg-gray-200"
            >
              Terminer
            </Button>
            <br />
          </Group></Box>) : (
          stap2 ? (<Box className='tw-absolute truc-fonce' >
            <Group position="center" className="">
              <Button
                size="md"
                onClick={toggleBoxList3}
                className="tw-text-black tw-mt-10 tw-px-8 tw-py-3 tw-bg-gradient-to-br tw-from-gray-200 tw-to-white tw-shadow-md tw-w-full tw-rounded-2xl tw-border-2 tw-border-white hover:tw-bg-gray-200"
              >
                retour
              </Button>
            </Group>
            <br />
            <Card className='tw-flex tw-bg-gray-50 tw-mb-2' radius={'lg'}>
              <Flex direction={'column'} className='tw-flex-1'>
                <Center>
                  <Group>
                    <Avatar className="tw-shadow-md" size={'lg'} radius={'xl'} src={`/uploads/${pacesportSubscription.association.avatar?.name}`} />
                    <Text fz={'md'} weight={600}>{pacesportSubscription.association.name}</Text>
                  </Group>
                </Center>
                <Center> <Text color='black'>{stap2.enseigne.name}</Text></Center>
                <Center> <Text color='black'>{stap2.description}</Text></Center>
                <br />
                {/* <Text color='dimmed'>{stap2}</Text> */}
                <ConfettiAnimation associationPartenaire={associationPartenaire} />
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
              <Title order={3} mb={'sm'} align="center">Mon Pace'Sport</Title>
              {pacesportSubscription &&
                <Center>
                  <Group>
                    {/* <Avatar className="tw-shadow-md" size={'lg'} radius={'xl'} src={`/uploads/${pacesportSubscription.association.avatar?.name}`} />
                    <Text fz={'md'} weight={600}>{pacesportSubscription.association.name}</Text> */}
                  </Group>
                </Center>
              }

              <Text className="tw-text-gray-800" align="center" mt={'sm'} fz={'sm'}>Abonné jusqu'au 30/06/2024</Text>
              <Center mt={'md'}>
                <Button onClick={() => setShowOffers(!showOffers)} color='white' variant='outline' className='tw-border-gray-700' radius={'lg'}>
                  <Text className='tw-text-gray-800' transform='uppercase' fz={'sm'}>Voir {showOffers ? 'moins' : 'les offres'}</Text>
                </Button>
                {/* <Text className="tw-border-[1px] tw-px-8 tw-py-0.5 tw-border-green-500 tw-bg-green-400 tw-text-gray-50 tw-rounded-xl tw-shadow-md">Possédée</Text> */}
              </Center>
            </Box>
            {showOffers &&
              <section className="tw-relative -tw-top-6">
                <Center>
                  <input
                    type="text"
                    placeholder="Rechercher par enseigne..."
                    value={searchText}
                    onChange={(e) => handleSearch2(e.target.value)}
                    className="tw-bg-gray-100 tw-rounded-full tw-py-2 tw-px-4 tw-w-full tw-mt-2 tw-mb-6 tw-text-sm tw-focus:tw-outline-none tw-border tw-border-gray-300"
                  />
                </Center>

                <OfferRow21 offer={searchResults} />
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
  const token = context.req.cookies['token_v3']
  let avatar = await fetch(`${process.env.API_URL}/api/user/avatar`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  avatar = await avatar.json();

  // let offers = await getActiveOffers(token)
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