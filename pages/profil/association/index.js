import { ActionIcon, Avatar, Badge, Box, Button, Card, Center, Divider, FileInput, Flex, List, Loader, Modal, Overlay, Paper, Select, Space, Text, TextInput, Title, Transition, useMantineTheme } from "@mantine/core";
import Head from "next/head";
import SearchSponsor from "./components/SearchSponsor";
import UserListButton from "./components/UserListButton";
import Layout from "./layout";
import SponsorInvitation from "./components/SponsorInvitation";
import { GoPlus } from 'react-icons/go'
import AssociationPendingOffers from "@/components/AssociationPendingOffers";
import Link from "next/link";
import { getCardActiveOffers, getAssociationPendingOffers } from "@/domain/repository/CardOffersRepository";
import { BsLink, BsLock, BsMegaphoneFill } from "react-icons/bs";
import { GrMoney } from "react-icons/gr";
import { BiMessage } from "react-icons/bi";
import CampagneCard from "./components/CampagneCard";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useForm } from "@mantine/form";
import { serialize } from "object-to-formdata";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { AiOutlineTaobao, AiOutlineSync } from "react-icons/ai";
import { getAssociationInvitationRequest, getAssociationSponsorInvitations } from "@/domain/repository/AssociationRepository";
import fileUploader from "@/utils/fileUploader";
import { getUser } from "@/domain/repository/UserRepository";
import { getPacesportCard } from "@/domain/repository/PacesportRepository";
import { getAllSponsors, getAllOffers } from "@/domain/repository/AdminRepository";
import SponsoringOfferTypeBadge from "@/components/SponsoringOfferTypeBadge";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/router";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

export default function Page(props) {
  const validationRequest = props.validationRequest
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()
  const [openInvitationModal, { open, close }] = useDisclosure(false);
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [contrat, setContrat] = useState(null)
  const [activeOffers, setActiveOffers] = useState(props.activeOffers)
  const [hasEnoughOffers, setHasEnoughOffers] = useState(props.invitations.length > 0)
  const [hasUploadedStatus, setHasUploadedStatus] = useState(false)
  const isAccountLimited = true
  const nbSponsorsNeeded = 3
  const [sponsorOffers, setSponsorOffers] = useState([])
  const [offers, setOffers] = useState([])
  const [showOffers, setShowOffers] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState("");
  const [search, setSearch] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState(null)
  const [ResultOffers, setResultOffers] = useState(null)
  const [sponsorSelect, setSponsorSelect] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  // Gestionnaire de sélection
  const selectedSponsorHandler = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      setSelectedSponsor(selectedOption.value);
    } else {
      setSelectedSponsor(selectedOption);
    }

    const filteredOffers = props.offers.filter(offer => {
      return offer.enseigne?.id === selectedSponsor?.id ||
        offer.codePostal?.startsWith(selectedSponsor?.postal) ||
        offer.ville?.toLowerCase() === selectedSponsor?.ville?.toLowerCase();
    });

    console.log(filteredOffers);
    setResultOffers(filteredOffers);
  };

  const requestLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const codePostal = await fetchYourGeocodingAPI(lat, lon);

        if (codePostal) {
          const firstTwoDigits = codePostal.substring(0, 2);

          // Mettez à jour la variable d'état qui suit la valeur de recherche du composant Select
          setSearchQuery(firstTwoDigits);  // Supposons que "setSearchQuery" est la méthode de réglage pour un état appelé "searchQuery"
          console.log(firstTwoDigits);
          // Si vous avez une fonction pour actualiser les résultats de recherche, appelez-la ici.
          // Par exemple: filterSponsorsByPostalCode(firstTwoDigits);
        } else {
          Toast.error('Impossible de récupérer le code postal pour votre position actuelle.')
        }
      }, (error) => {
        Toast.error('Erreur de géolocalisation.')
      });
    } else {
      Toast.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
    }
  };



  const filteredSponsors = useMemo(() => {
    if (!searchCriteria) return props.sponsors; // si aucun critère de recherche n'est défini, retournez tous les partenaires

    return props.sponsors.filter(sponsor =>
      sponsor.codePostal && sponsor.codePostal.startsWith(searchCriteria)
    );
  }, [props.sponsors, searchCriteria]);

  // Mise à jour de la sélection de sponsors
  const updatedSponsorSelect = filteredSponsors.map(sponsor => ({
    label: `${sponsor.name} ${sponsor.postal ?? ''} ${sponsor.ville ?? ''}`,
    value: sponsor
  }));

  useEffect(() => {
    if (selectedSponsor == null) {
      return
    }
    setFetching(true)
    setOffers([])
    fetch(`/api/sponsoring-offer-by-enseigne-active/${selectedSponsor}`, {
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
  }, [selectedSponsor]);

  const form = useForm({
    initialValues: {
      statut: '',
    },
    validate: {
      statut: (value) => (value instanceof File ? null : 'Veuillez importer un fichier'),
    },
  });

  const OfferRow = ({ offer }) => (
    <Card className='tw-flex tw-bg-gray-200 tw-mb-2' radius={'lg'}>
      <Center>
        <Avatar className='tw-shadow-md' radius={'lg'} src={`/uploads/${offer.enseigne?.avatar?.name}`} />
      </Center>
      <Flex direction={'column'} className='tw-flex-1 tw-px-3'>
        <Flex justify={'space-between'}>
          <Text weight={550}>{offer.description} <SponsoringOfferTypeBadge offer={offer} /></Text>
          <Text className='tw-flex tw-font-light' fz={'sm'}>
            <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />{offer.association?.ville ? offer.association.ville : "Lyon"}</Text>
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


  const submitHandler = (values) => {
    setLoading(true)
    fileUploader(values.statut)
      .then((response) => {
        let body = new FormData();
        body.append('filename', response.data.filename)
        fetch(`/api/association/validation-request`, {
          method: 'POST',
          type: 'cors',
          headers: new Headers({
            'JWTAuthorization': `Bearer ${getCookie('token')}`
          }),
          body: body
        })
          .then(res => res.json())
          .then(res => {
            res.data.code == 1
              ? Toast.success(res.data.message)
              : Toast.error(res.data.message)
            setLoading(false)
          })
          .catch((error) => {
            Toast.error('Erreur pendant l\'enregistrement de la demande')
            setLoading(false)
          })
          .catch((error) => {
            Toast.error('Erreur pendant le téléchargement du fichier')
            setLoading(false)
          })
      });
  }

  const emailForm = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail'),
    },
  });

  const emailSubmitHandler = (values) => {
    setLoading(true)
    let body = serialize(values)
    fetch(`/api/mail/invitation`, {
      method: 'POST',
      headers: new Headers({
        'JWTAuthorization': `Bearer ${getCookie('token')}`
      }),
      body: body
    }).then(res => res.json())
      .then(res => {
        if (res.data) {
          Toast.success('Invitation envoyée')
        }
        setLoading(false)
        close()
      })
      .catch((error) => {
        Toast.error('Erreur pendant l\'envoi du mail')
        setLoading(false)
        close()
      })
  }

  const labels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'];
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: false,
        text: '',
      },
    },
  };
  const ChartData = {
    labels,
    datasets: [
      {
        label: '',
        data: labels.map(() => (0 * (15 - 2)).toFixed(0)),
        backgroundColor: 'rgba(150, 150, 150, 0.8)',
      },
    ],
  };

  const ChartSection = (props) => <Center {...props}>
    <Bar options={options} data={ChartData} />
  </Center>

  return (
    <>
      <Head>
        <title>PACE'SPORT - Mon compte</title>
        <meta name="description" content="PACE'SPORT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="tw-px-4 tw-pt-8 tw-relative">
        <Box className="tw-relative">
          <Title my={'md'} order={4} align="center">{props.user?.association?.name}</Title>
          {/* <ActionIcon component='a' href='/communication/add/association?prev=/profil/association' className="tw-bg-white tw-absolute tw-right-1.5 tw-bottom-0 tw-p-1.5" radius={'xl'}>
                        <BsMegaphoneFill className="tw-text-black" size={18} />
                    </ActionIcon> */}
        </Box>
        {/* <SponsorInvitation /> */}
      </section>

      <section className="tw-bg-white tw-mt-6 tw-shadow-inner tw-py-4 tw-px-4">
        {validationRequest?.validated == false && <Center className="tw-z-50"><Text color="orange">Votre demande est en attente de validation</Text></Center>}
        {validationRequest?.validated == false &&
          <form className="tw-relative" onSubmit={form.onSubmit((values) => submitHandler(values))}>
            {validationRequest && <Overlay className="tw-rounded-3xl tw-mx-1 tw-mb-1" opacity={0.1} color="#000" blur={1} />}
            <Box className="tw-border-[1px] tw-border-gray-300 tw-shadow-sm tw-rounded-3xl" mx={'xs'} px={'md'} py={'md'}>
              <Text fz={'sm'} mb={'sm'}>Nb offres: <span>3</span></Text>
              <FileInput
                className="placeholder:tw-text-[#d61515]"
                rightSection={<AiOutlineFileText className="tw-text-gray-800" size={18} />}
                placeholder="Ajouter un fichier"
                label="Statut"
                withAsterisk
                mb={'sm'}
                {...form.getInputProps('statut')} />
              <List className="tw-list-disc" type="unordered" size={'sm'} mt={'md'}>
                <List.Item className={hasEnoughOffers ? 'tw-text-emerald-600/80' : 'tw-text-[#d61515]'}>
                  Vous avez au moins 3 offres</List.Item>
                <List.Item className={hasUploadedStatus ? 'tw-text-emerald-600/80' : ''}>
                  Vous avez joint vos statuts</List.Item>
                <List.Item className="">
                  <Link className="tw-text-blue-600 hover:tw-text-blue-700 tw-underline" target="_blank"
                    href="/Contrat_partenaire_PACESPORT.pdf">Contrat à remplir et joindre</Link>
                </List.Item>
              </List>
            </Box>
            <Center>
              <Button type="submit" size="xs"
                className="tw-border-[1px] tw-border-gray-300 tw-bg-white tw-text-gray-600 
                                    tw-text-xs tw-rounded-3xl tw-px-10 tw-h-8 tw-mt-4 tw-mb-5 tw-shadow-md
                                    hover:tw-bg-gray-200"
                disabled={loading || validationRequest != null}>
                Envoyer pour  validation</Button>
            </Center>
          </form>}
        {validationRequest?.validated == true && <Text color="green" align="center">Association validée</Text>}
        {validationRequest?.validated == true &&
          <Flex justify={'space-between'} my={'lg'} className="tw-relative">
            <Text className="tw-flex-1" color="red" fz={'sm'} fw={'bold'} align={'center'} py={2}>Ajoutez encore {nbSponsorsNeeded} partenaires pour valider votre pace'sport</Text>
          </Flex>}
        <CampagneCard status={props?.pacesportCard?.status == '1' && activeOffers?.some(offer => offer?.type === 'Nationale')} id={1} title={'Carte pacesport'} image2={props.user?.association?.avatar?.name} image={props.pacesportCard?.image?.name} startDate={Date.now()} />
        <Divider my={'sm'} className="tw-w-2/3 tw-mx-auto" />

        <Center>
          <Button size="xs"
            onClick={() => open(true)}
            className="tw-bg-[#d61515] tw-text-gray-100 tw-text-xs tw-rounded-3xl tw-px-10 tw-h-6 tw-my-2 tw-shadow-md
                        hover:tw-bg-[#d61515]">
            Inviter des partenaires par email</Button>
        </Center>

        <Divider my={'sm'} className="tw-w-2/3 tw-mx-auto" />

        <Title align="center" color="white" order={6}
          className="tw-bg-gray-400 tw-font-light tw-pb-1 tw-mt-4">Nouvelles offres de partenariat</Title>
        <AssociationPendingOffers offers={props.pendingOffers} />

        <Divider my={'sm'} className="tw-w-2/3 tw-mx-auto" />
        <Title align='center' order={6}>Les partenaires de pace'sport</Title>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '0 0 95%' }}>
            <Select
              searchable
              label={'Choisir partenaire'}
              placeholder={props.sponsors.length > 0 ? 'Partenaire' : 'Aucun partenaire trouvé'}
              rightSectionWidth={30}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={updatedSponsorSelect}
              searchValue={searchQuery}
              onChange={selectedSponsorHandler}
              onSearchChange={newSearchValue => setSearchQuery(newSearchValue)} // Mettre à jour searchQuery lors de la modification de la chaîne de recherche
            />
          </div>
          <Button onClick={requestLocation}><FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' /></Button>
        </div>



        <Title order={6} my={'lg'} align='center'>Les offres</Title>
        {fetching &&
          <Center>
            <Loader />
          </Center>
        }
        {!ResultOffers
          ? fetching
            ? <></>
            : <Text color='dimmed' align='center'>{'Aucune offre'}</Text>
          : ResultOffers.map((offer) => (
            <OfferRow key={offer.title} offer={offer} />
          ))
        }
        <Space my={'md'} />

      </section>

      {/* <Space className="tw-pt-4"></Space>
      <Box className="tw-relative">
        <ChartSection className="tw-bg-white tw-p-10 tw-z-10 tw-relative" />
      </Box> */}
      {/* <Space className="tw-mt-8"></Space> */}

      {/* <section className="tw-bg-lightgold-50 tw-flex tw-flex-col tw-py-4">
                <Text color="white" align="center">Offre de sponsoring</Text>
                <Text className="tw-flex tw-justify-center" align="center">Uniquement avec Pace'sport Business<BsLock className='tw-my-auto tw-ml-1'/></Text>
                <Button onClick={open} color="white" variant="filled" size="xs" 
                    className="tw-bg-white tw-text-black hover:tw-bg-gray-200 tw-mx-auto tw-mt-3" radius={'lg'}>En savoir plus</Button>
            </section> */}


      <section className="tw-flex tw-flex-col tw-py-4 tw-bg-[#d61515]">
        <Link href='/messages' className="tw-mx-auto tw-mt-3">
          <Button color="white" variant="filled" size="sm" leftIcon={<BiMessage />} miw={200}
            className="tw-bg-white tw-text-black hover:tw-bg-gray-200" radius={'lg'}>
            Messagerie</Button></Link>
        <Link href={`/profil/association/gestion-fonds?prev=/profil/association`} className="tw-mx-auto tw-mt-3">
          <Button color="white" variant="filled" size="sm" leftIcon={<GrMoney />} miw={200}
            className="tw-bg-white tw-text-black hover:tw-bg-gray-200" radius={'lg'}>
            Centre de gestion</Button></Link>
      </section>

      <Modal radius={'lg'} className="" opened={openInvitationModal} onClose={close} centered
        title={<Title className="tw-mx-auto" transform="uppercase" align="center" order={6}>Inviter des partenaires</Title>}>
        <Box align='' mt={'md'} p={'xs'}>
          <form onSubmit={emailForm.onSubmit((values) => emailSubmitHandler(values))} className="tw-my-4">
            <TextInput mt="sm" variant="filled" className="" description="E-mail" placeholder="E-mail" radius="md" size="sm" withAsterisk
              {...emailForm.getInputProps('email')} />

            <Center>
              <Button type="submit" size="xs"
                disabled={loading}
                className="tw-bg-[#d61515] tw-text-gray-100 tw-text-xs tw-rounded-3xl tw-px-10 tw-h-8 tw-mt-8 tw-shadow-md
                                    hover:tw-bg-[#d61515]">
                {loading ? <Loader color="orange" size="xs" /> : ' Envoyer'}</Button>
            </Center>
          </form>
        </Box>
      </Modal>
    </>
  )
}

const selectedSponsorHandler = (selectedOption) => {
  console.log(selectedOption)
  // Si l'option sélectionnée est un objet avec une valeur et une étiquette
  if (selectedOption && selectedOption.value) {
    setSelectedSponsor(selectedOption.value);
  } else {
    setSelectedSponsor(selectedOption);
  }
};



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
export async function getServerSideProps(context) {
  const token = context.req.cookies['token']

  let avatar = await fetch(`${process.env.API_URL}/api/association/avatar`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  avatar = await avatar.json();
  if (avatar.code == 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }
  }

  let cards = await fetch(`${process.env.API_URL}/api/discount-card/association/`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  cards = await cards.json();

  let enseigne = await fetch(`${process.env.API_URL}/api/enseigne/auth/`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  enseigne = await enseigne.json();

  let backgroundImage = await fetch(`${process.env.API_URL}/api/association/background`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  backgroundImage = await backgroundImage.json();

  let invitations = await getAssociationSponsorInvitations(token)
  let validationRequest = await getAssociationInvitationRequest(token)
  let user = await getUser(token)
  let pacesport = await getPacesportCard(token)
  let sponsors = await getAllSponsors(token)
  let activeOffers = await getCardActiveOffers(token)
  let pendingOffers = await getAssociationPendingOffers(token)
  let offers = await getAllOffers(token)
  // fetch Associations
  let associations = await fetch(`${process.env.API_URL}/api/association/list`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  associations = await associations.json();
  // // Pass data to the page via props
  return {
    props: {
      backgroundImage: backgroundImage.filename,
      avatar: avatar.filename,
      cards: JSON.parse(cards.data),
      hasFinishedTutorial: true,
      invitations: JSON.parse(invitations.data),
      validationRequest: JSON.parse(validationRequest.data),
      user: JSON.parse(user.data),
      pacesportCard: JSON.parse(pacesport.data),
      associations: JSON.parse(associations.data),
      activeOffers: JSON.parse(activeOffers.data),
      pendingOffers: JSON.parse(pendingOffers.data),
      sponsors: JSON.parse(sponsors.data),
      offers: JSON.parse(offers.data)
    }
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout avatar={null}>{page}</Layout>
  )
}