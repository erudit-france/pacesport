import Head from "next/head"
import Layout from "./layout"
import Link from "next/link"
import { GoPlus } from 'react-icons/go'
import { IoStatsChartSharp } from 'react-icons/io5'
import { Button, Flex, Image, Modal, Space, Text, TextInput, Textarea, Title } from "@mantine/core"
import { useState } from "react"
import OfferList from "../partenariat/components/OfferList"

export default function Page(props) {
    console.log('props', props)
    const [opened, setOpened] = useState(false);
    const [currentOffer, setCurrentOffer] = useState(null);
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
        <Flex  className="tw-shadow-md tw-bg-gray-50" justify={'space-between'} px={'md'}>
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

    const activeOffersList = props.activeOffers.length == 0
            ? <Text align="center" color="dimmed" fz={'xs'}>Aucune offre</Text>
            : props.sponsoringOffers.map((offer) => (
                <OfferRow key={offer.title} offer={offer} />
            ))

    const offersList = props.sponsoringOffers.length == 0
            ? <Text align="center" color="dimmed" fz={'xs'}>Aucune offre</Text>
            : props.sponsoringOffers.map((offer) => (
                <OfferRow key={offer.title} offer={offer} />
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
  
    // // Pass data to the page via props
    return { props: { 
      sponsoringOffers: JSON.parse(sponsoringOffers.data),
      activeOffers: []
    } }
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout text="Partenariat" subtext={"Sponsoring"}>{page}</Layout>
    )
}