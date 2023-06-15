import Head from "next/head"
import Layout from "./layout"
import Link from "next/link"
import { GoPlus } from 'react-icons/go'
import { IoStatsChartSharp } from 'react-icons/io5'
import { Avatar, Box, Button, Center, Divider, Flex, Group, Image, Modal, Space, Text, TextInput, Textarea, Title } from "@mantine/core"
import { useState } from "react"
import OfferList from "../partenariat/components/OfferList"
import Toast from "@/services/Toast"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"

export default function Page(props) {
    const router = useRouter()
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentOffer, setCurrentOffer] = useState(null);
    const refresh = () => { router.reload(window.location.pathname) }

    const acceptOffer = (id) => {
        setLoading(true)
        fetch(`/api/sponsoring-offer-proposition/accept`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({offerId: id})
          })
            .then(res => res.json())
            .then(res => {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => { Toast.error('Erreur') })
        setLoading(false)
    }

    const declineOffer = (id) => {
        setLoading(true)
        fetch(`/api/sponsoring-offer-proposition/decline`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({offerId: id})
          })
            .then(res => res.json())
            .then(res => {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => { Toast.error('Erreur') })
        setLoading(false)
    }

    const OfferRow = ({offer}) => (
        <Flex  className="tw-shadow-md tw-bg-gray-50" justify={'space-between'} px={'md'} mb={'xs'}>
            <Image
                width={140}
                height={90}
                src={offer.images.length > 0 ? '/uploads/' + offer.images[0].filename : null}
                alt="With default placeholder"
                />
            <Flex className="tw-flex-col" justify={'center'} align={'center'}>
                <Text align="center" fz={'sm'}>{offer.title}</Text>
                <Text align="center" fz={'sm'} color="dimmed">{offer.description}</Text>
                {/* <Text align="center" fz={'xs'} className="tw-font-light tw-text-red-700">Attente de paiement</Text> */}
            </Flex>
            <Flex justify={'center'} align={'center'}>
                <Button onClick={() => { setOpened(true); setCurrentOffer(offer) }}
                    variant="outline" radius={'lg'} 
                    className="tw-border-yellow-600/70 tw-text-yellow-600/70
                    hover:tw-bg-yellow-600/80 hover:tw-text-white
                        tw-border-[1.8px] tw-text-sm tw-py-1 tw-px-2">
                    Détails</Button>
            </Flex>
        </Flex>
    )

    
    const ActiveOfferRow = ({offer}) => (
        <Box className="tw-shadow-md tw-bg-gray- tw-py-2">
        <Flex justify={'space-between'} px={'md'}>
            <Image
                width={140}
                height={90}
                src={offer.images.length > 0 ? '/uploads/' + offer.images[0].filename : null}
                alt="With default placeholder"
                />
            <Box className="tw-flex-1">
                <Text align="left" weight={600} fz={'md'}>{offer.title}</Text>
                <Text align="left" fz={'sm'} color="dimmed">{offer.description}</Text>
                <Divider my={'md'} />
                <Group mb={'md'}>
                    <Avatar radius={'xl'} size={'sm'} className="tw-shadow-md" src={`/uploads/${offer.activeProposition.sponsor.avatar?.name}`} />
                    <Text fz={'sm'}>{offer.activeProposition.sponsor.name}</Text>
                </Group>
                <Text color="dimmed" fz={'sm'}>
                    {offer.activeProposition.description}
                </Text>
            </Box>
        </Flex>
        </Box>
    )

    const OfferPropositionRow = ({offer}) => {
        var sponsoringOfferImg = offer.sponsoringOffer.images.length != 0 ? '/uploads/' + offer.sponsoringOffer.images[0].name : null
        return (
            <Box className="tw-flex-1 tw-border-b-2 tw-m-3 tw-p-3 tw-rounded-md tw-shadow-sm">
                <Group mb={'md'}>
                    <Avatar radius={'xl'} size={'md'} className="tw-shadow-md" src={`${sponsoringOfferImg}`} />
                    <Text fz={'md'} weight={600}>{offer.sponsoringOffer.title}</Text>
                </Group>
                <Group mb={'md'}>
                    <Avatar radius={'xl'} size={'sm'} className="tw-shadow-md" src={`/uploads/${offer.sponsor.avatar?.name}`} />
                    <Text fz={'sm'}>{offer.sponsor.name}</Text>
                </Group>
                <Text align="left" fz={'sm'}>{offer.description}</Text>
                <OfferPropositionStatus offer={offer} />
            </Box>
        )
    }

    const OfferPropositionStatus = ({offer}) => {
        if (offer.accepted == null && offer.declined == null) {
            return <>
                <Flex justify={'space-around'} my={('lg')}>
                    <Button size="sm" color="green" disabled={loading} variant="outline"
                        onClick={() => acceptOffer(offer.id)}>Accepter</Button>
                    <Button size="sm" color="red" disabled={loading} variant="outline"
                        onClick={() => declineOffer(offer.id)}>Refuser</Button>
                </Flex>
            </>
        }

        if (offer.accepted == true && offer.paid == null) {
            return (
                <Text align="center" my={'md'} className="tw-text-yellow-900 tw-font-semibold">Offre acceptée, en attente de paiement</Text>
            )
        }
        
        if (offer.accepted == true && offer.paid == true) {
            return (
                <Text align="center" my={'md'} className="tw-text-green-900 tw-font-semibold">Offre acceptée et payée</Text>
            )
        }
    }

    const activeOffersList = props.activeOffers.length == 0
            ? <Text align="center" color="dimmed" fz={'xs'}>Aucune offre</Text>
            : props.activeOffers.map((offer) => (
                <ActiveOfferRow key={offer.title} offer={offer} />
            ))

    const offersList = props.sponsoringOffers.length == 0
            ? <Text align="center" color="dimmed" fz={'xs'}>Aucune offre</Text>
            : props.sponsoringOffers.map((offer) => (
                <OfferRow key={offer.title} offer={offer} />
            ))

    const pendingPropositionsList = props.pendingPropositions.length == 0
        ? <Text align="center" color="dimmed" fz={'xs'}>Aucune proposition</Text>
        : props.pendingPropositions.map((offer) => (
            <OfferPropositionRow key={offer.title} offer={offer} />
        ))

    const SponsoringOfferModal = () => {
        if (currentOffer == null) {
            return <></>
        }
        return (  
        <Modal
            className="tw-z-[9999]"
            opened={opened}
            onClose={() => { setOpened(false); setCurrentOffer(null) }}
        >
            <Flex>
                <Image
                    className="tw-mx-auto"
                    width={160}
                    height={100}
                    src={currentOffer.images.length > 0 ? '/uploads/' + currentOffer.images[0].filename : null}
                    alt="With default placeholder"
                    withPlaceholder
                    />
            </Flex>
            <Flex my={'lg'} direction={'column'}>
                    <TextInput
                        className="tw-font-semibold"
                        variant="filled"
                        readOnly
                        description="Titre"
                        value={`${currentOffer.title}`}
                        />
                <Flex my={'lg'}>
                    <TextInput
                        className="tw-font-semibold"
                        variant="filled"
                        readOnly
                        description="Prix"
                        value={`${currentOffer.price} €`}
                        />
                    <TextInput
                        className="tw-font-semibold"
                        variant="filled"
                        readOnly
                        description="Durée"
                        value={`${currentOffer.duration} mois`}
                        />
                </Flex>
                <Textarea
                    variant="filled"
                    label="Description"
                    value={currentOffer.description}
                    autosize
                    />
            </Flex>
    </Modal>
        )
    }

    return (
        <>
            <Head><title>Sponsoring</title></Head>
            <header className="tw-flex tw-justify-around">
                <Link href='/sponsoring/add'>
                    <Button variant="outline" radius={'lg'} className="tw-border-gray-800 tw-text-gray-800" rightIcon={<GoPlus />}>
                        Créer une offre</Button></Link>
                <Link href=''>
                    <Button variant="filled" radius={'lg'} className="tw-bg-yellow-600/70 hover:tw-bg-yellow-600/80 tw-text-white">
                    Suivi</Button></Link>
                <Link href=''>
                    <Button variant="outline" radius={'lg'} className="tw-border-gray-800 tw-text-gray-800">
                        <IoStatsChartSharp /></Button></Link>
            </header>

            <Title order={1} className="tw-bg-yellow-600/70 tw-text-white tw-py-1 tw-shadow-sm tw-mt-8" mb={'md'} size='h6' align="center">Offres actives</Title>
            {activeOffersList}

            <Space  h={'lg'} my={'xl'} />
            
            <Title order={1} className="tw-bg-yellow-600/70 tw-text-white tw-py-1 tw-shadow-sm tw-mt-8" mb={'md'} size='h6' align="center">Propositions en attentes</Title>
            {pendingPropositionsList}

            <Space  h={'lg'} my={'xl'} />

            <Title order={1} className="tw-bg-yellow-600/70 tw-text-white tw-py-1 tw-shadow-sm tw-mt-6" mb={'md'} size='h6' align="center">Mes offres</Title>
            {offersList}


            <SponsoringOfferModal offer={currentOffer} />
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let sponsoringOffers = await fetch(`${process.env.API_URL}/api/sponsoring-offer-association`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
    )
    sponsoringOffers = await sponsoringOffers.json();

    
    let activeOffers = await fetch(`${process.env.API_URL}/api/sponsoring-offer-association-active`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
    activeOffers = await activeOffers.json();

    let pendingPropositions = await fetch(`${process.env.API_URL}/api/sponsoring-offer-propositions-by-association/pending/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
    pendingPropositions = await pendingPropositions.json();
    

    console.log('pendingPropositions', pendingPropositions)
  
    // // Pass data to the page via props
    return { props: { 
      sponsoringOffers: JSON.parse(sponsoringOffers.data),
      activeOffers: JSON.parse(activeOffers.data),
      pendingPropositions: JSON.parse(pendingPropositions.data),
    } }
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout text="Partenariat" subtext={"Sponsoring"}>{page}</Layout>
    )
}