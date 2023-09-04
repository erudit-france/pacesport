import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { Box, Button, Center, CloseButton, Grid, Group, Modal, Space, Text, TextInput, Title } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import Layout from './layout'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import * as cookie from 'cookie'
import { useRouter } from 'next/router'
import OrganisationCard from '@/components/OrganisationCard'
import OrganisationCardParticulier from '@/components/OrganisationCardParticulier'
import AssociationCardParticulier from '@/components/AssociationCardParticulier'
import CommunicationAdsCarousel from '@/components/CommunicationAdsCarousel'
import AssociationCarte from '@/components/AssociationCarte'
import { useDebouncedValue } from '@mantine/hooks'
import { getActiveSubscription } from '@/domain/repository/OrderRepository'
import axios from "axios";

const SectionTitle = (props) => (
  <Title {...props} order={4} align='center' transform='uppercase' mb={"lg"}>{props.children}</Title>
)

const DiscountCardsGrid = ({ cards }) => {
  return (
    <Grid gutter={12} className="mt-4 tw-px-3">
      {cards.map(function (card) {
        return (
          <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
            <AssociationCardParticulier card={card} />
          </Grid.Col>
        )
      }
      )}
    </Grid>
  )
}

export default function Page(props) {
  const router = useRouter()
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState('')
  const [filteredAssociations, setFilteredAssociations] = useState(props.associations)
  const [debouncedSearch, cancel] = useDebouncedValue(search, 300)

  useEffect(() => {
    if (debouncedSearch.match(/^\d+$/)) { // Si debouncedSearch est un code postal
      let results = props.associations.filter(o =>
        o.postal && o.postal.toLowerCase().includes(debouncedSearch.toLowerCase()));

      // Si aucun résultat n'est trouvé et le code postal a plus de 2 chiffres, essayez de rechercher avec les 2 premiers chiffres
      if (results.length === 0 && debouncedSearch.length > 2) {
        results = props.associations.filter(o =>
          o.postal && o.postal.startsWith(debouncedSearch.substring(0, 2)));
      }

      setFilteredAssociations(results);
    } else { // Sinon, c'est un nom d'association
      const results = props.associations.filter(o =>
        o.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
      setFilteredAssociations(results);
    }


  }, [debouncedSearch, props.associations])



  const handleSearch = (event) => {
    setSearch(event.currentTarget.value)
    // if (props.associations.length == 0) {
    //   setFilteredAssociations([]) 
    //   return
    // }
    // const results = props.associations.filter(o =>
    //   o.name.toLowerCase().includes(search.toLowerCase()))
    // setFilteredAssociations(results)
  }
  const requestLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("test")
        // Ici, vous devrez faire appel à une API ou un service pour obtenir le code postal 
        // basé sur les coordonnées. Par exemple, en utilisant une API comme OpenStreetMap, Mapbox, etc.
        const codePostal = await fetchYourGeocodingAPI(lat, lon);

        if (codePostal) {
          setSearch(codePostal);
        } else {
          alert("Impossible de récupérer le code postal pour votre position actuelle.");
        }
      }, (error) => {
        alert("Erreur lors de la récupération de la position. Assurez-vous d'avoir donné la permission.");
      });
    } else {
      alert("La géolocalisation n'est pas prise en charge sur votre appareil.");
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
  const clear = () => {
    setSearch('')
    setFilteredAssociations(props.associations)
  }

  const associations = filteredAssociations.map((card) => {
    return (
      <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
        <AssociationCarte organisation={card} href={`/profil/particulier/carte/souscrire/${card.id}`} />
      </Grid.Col>
    )
  })
console.log(filteredAssociations)
  const associationsGrid = filteredAssociations.length == 0
    ? <Text fz={'sm'} align="center" color="dimmed">Aucune association enregistrée</Text>
    : <Grid gutter={18} className="tw-px-4 tw-m-[0px]">{associations}</Grid>

  return (
    <>
      <Head>
        <title>PACE'SPORT</title>
        <meta name="description" content="PACE'SPORT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={''} >
        <Center><div className="tw-bg-[#EE2323] tw-w-[25%] tw-pl-[20px] tw-pr-[20px] tw-min-w-fit tw-rounded-full">
        <SectionTitle className='tw-text-white tw-text-xl tw-mb-5 tw-h-3'>Bienvenue sur Pace'Sport</SectionTitle>
</div></Center>
        {/* Enseigne proche */}
        <section className='tw-mt-2'>
          <SectionTitle className='tw-text-gray-800 tw-text-base'>Associations proches de vous</SectionTitle>
          {/* search input */}
          <section className='tw-px-8 tw-mb-4'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '0 0 95%' }}>
            <TextInput
              className={`focus:tw-border-[#d61515]`}
              size={"md"}
              radius={"xl"}
              placeholder="Nom de l'association..."
              rightSection={search == '' ? '' : <CloseButton mr={'sm'} radius={'lg'} aria-label="Vider" onClick={clear} />}
              value={search}
              onChange={handleSearch}
            />
            </div>
  <Button onClick={requestLocation} className='tw-pb-[12px]'><FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' /></Button>
</div>
          </section>
          {/* <EnseigneGrid /> */}
          {associationsGrid}
        </section>



        {/* Autres sections de votre code... */}
      </div>


    </>
  )
}


export async function getServerSideProps(context) {
  const token = context.req.cookies['token']
  let pacesportSubscription = await getActiveSubscription(token);
  if (!(pacesportSubscription.data === 'null' || pacesportSubscription.data == null)) {
    return {
      redirect: {
        permanent: false,
        destination: "/profil/particulier/carte"
      }
    };
  }

  const res = await fetch(`${process.env.API_URL}/api/discount-card`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
    )
  const data = await res.json()
  if (data.code == 401) 
  return {
    redirect: {
      permanent: false,
      destination: "/login/as"
    }
  }

  let possessedCardsRes = await fetch(`${process.env.API_URL}/api/discount-card-user`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  possessedCardsRes = await possessedCardsRes.json()


  let avatar = await fetch(`${process.env.API_URL}/api/user/avatar`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  avatar = await avatar.json();

  // fetch Associations
  let associations = await fetch(`${process.env.API_URL}/api/association/list`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  associations = await associations.json();


  let communications = await fetch(`${process.env.API_URL}/api/communication/all`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  communications = await communications.json();


  // // Pass data to the page via props
  return {
    props: {
      cards: JSON.parse(data.data),
      avatar: avatar.filename,
      associations: JSON.parse(associations.data),
      possessedCards: JSON.parse(possessedCardsRes.data),
      communications: JSON.parse(communications.data)
    }
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout avatar={null}>{page}</Layout>
  )
}