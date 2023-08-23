import { ActionIcon, Badge, Box, Button, Card, Center, Divider, FileInput, Flex, List, Modal, Overlay, Paper, Space, Text, TextInput, Title, useMantineTheme } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { BsLink, BsLock, BsMegaphoneFill } from "react-icons/bs";
import { randomId, useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import AssociationPendingOffers from "@/components/AssociationPendingOffers";
import { getAssociationPacesportPendingOffers, getAssociationPendingOffers, getCardActiveOffers, getOffers } from "@/domain/repository/CardOffersRepository";
import { useForm } from "@mantine/form";
import AssociationPacesportPendingOffers from "@/components/AssociationPacesportPendingOffers";
import AssociationActiveOffers from "@/components/AssociationActiveOffers";
import { getPacesportCard } from "@/domain/repository/PacesportRepository";
import Image from "next/image";

export default function Page(props){
    const [pendingOffers, setPendingOffers] = useState(props.pendingOffers)
    const [pacesportPendingOffers, setPacesportPendingOffers] = useState(props.pacesportPendingOffers)
    const [activeOffers, setActiveOffers] = useState(props.activeOffers)
    const PacesportCard = ({card}) => {
        if (!card) return <></>
        let src = '/logo.png'
        if (card.image) {
            src = `/uploads/${card.image.name}`
        }
        return (
            <Center>
                <Box className="tw-rounded-xl tw-shadow-lg tw-relative tw-h-[110px] tw-w-[200px] tw-overflow-hidden">
                    <Image
                        className="tw-absolute tw-z-20 tw-right-1 tw-opacity-80 -tw-translate-y-1/2 tw-top-1/2"
                        width={24}
                        height={24}
                        src={props.association?.avatar?.name}
                        alt="logo sim"
                    />
                    <Image
                    className="tw-opacity-95"
                    radius={'lg'}
                    width={200}
                    height={110}
                    src={`${src}`}
                    alt="Photo de campagne"
                    />
                </Box>
            </Center>
        )
    }

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Mon compte</title>
                <meta name="description" content="PACE&lsquo;SPORT" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <Link className="tw-border-[1px] tw-px-8 tw-py-0.5 tw-border-[#d61515] tw-rounded-xl tw-shadow-md hover:tw-bg-gray-100" 
                        href={props.prev}>Retour</Link> */}
            <section className="tw-px-4 tw-pt-14 tw-relative">
                <Box className="tw-relative">
                    <Title my={'md'} order={4} align="center">{props.association?.name}</Title>
                </Box>
            </section>

            <main className="tw-bg-white tw-rounded-t-3xl tw-w-full tw-min-h-[calc(100vh-242px)]">
                <Card radius={'lg'} className="tw-overflow-hidden">
                    <PacesportCard card={props.pacesportCard} />
                    <Text color='dimmed' align='center'>Conditions d'activation :</Text>
                    <Text color={props?.pacesportCard?.status == '1' ? 'green' : 'orange'} align='center'>Status en cours de validation</Text>
                    <Text color={activeOffers.some(offer => offer?.type === 'Nationale') ? 'green' : 'orange'} align='center'>Minimum 1 offre nationnale validée</Text>
                </Card>

                <Space h={'sm'} />

                <Title align="center" color="white" order={6}
                    className="tw-bg-gray-400 tw-font-light tw-pb-1 tw-mt-4">Nouvelles offres de partenariat</Title>
                <AssociationPendingOffers offers={pendingOffers} />

                <Title align="center" color="white" order={6}
                    className="tw-bg-[#d61515] tw-font-light tw-pb-1 tw-mt-4">En attente de validation Pace&lsquo;Sport</Title>
                <AssociationPacesportPendingOffers offers={pacesportPendingOffers} />

                <Title align="center" color="white" order={6}
                    className="tw-bg-green-600 tw-font-light tw-pb-1 tw-mt-4">Offres de partenariat validées</Title>
                <AssociationActiveOffers offers={activeOffers} />
            </main>

        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']

    let avatar = await fetch(`${process.env.API_URL}/api/association/avatar`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
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

    let enseigne = await fetch(`${process.env.API_URL}/api/enseigne/auth/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    enseigne = await enseigne.json();


    let backgroundImage = await fetch(`${process.env.API_URL}/api/association/background`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
    backgroundImage = await backgroundImage.json();

    let pendingOffers = await getAssociationPendingOffers(token)
    let pacesportPendingOffers = await getAssociationPacesportPendingOffers(token)
    let activeOffers = await getCardActiveOffers(token)
    let pacesport = await getPacesportCard(token)
    let prev = ''
    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        pendingOffers: JSON.parse(pendingOffers.data),
        pacesportPendingOffers: JSON.parse(pacesportPendingOffers.data),
        activeOffers: JSON.parse(activeOffers.data),
        pacesportCard: JSON.parse(pacesport.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }