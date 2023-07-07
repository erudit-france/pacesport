import { ActionIcon, Box, Button, Center, Divider, FileInput, Flex, List, Modal, Overlay, Paper, Space, Text, TextInput, Title, useMantineTheme } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { BsLink, BsLock, BsMegaphoneFill } from "react-icons/bs";
import { randomId, useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import AssociationPendingOffers from "@/components/AssociationPendingOffers";
import { getOffers } from "@/domain/repository/CardOffersRepository";
import { useForm } from "@mantine/form";

export default function Page(props){
    const form = useForm({
        initialValues: {
          statut: '',
        },
        validate: {
          statut: (value) => (value instanceof File ? null : 'Veuillez importer un fichier'),
        },
    });

    const submitHandler = (values) => {
        console.log('values', values.statut instanceof File)
    }

    const hasUploadedStatus = false
    const hasEnoughOffers = true
    let fakeOffers = [
        {
            id: 1,
            title: 'Auchan',
            city: 'Lyon',
            description: '5% de réduction sur les articles ...',
            img: 'https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png'
        },
        {
            id: 2,
            title: 'Décathlon',
            city: 'Lyon',
            description: '5% de réduction sur les articles ...',
            img: 'https://logo-marque.com/wp-content/uploads/2020/12/Decathlon-Embleme.png'
        },
        {
            id: 3,
            title: 'Cerise et Potiron',
            city: 'Lyon',
            description: '5% de réduction sur les articles ...',
            img: 'https://www.cerise-et-potiron.fr/wp-content/uploads/2021/06/logo-cp.png'
        }
    ]

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Mon compte</title>
                <meta name="description" content="PACE&lsquo;SPORT" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <section className="tw-px-4 tw-pt-14 tw-relative">
                <Box className="tw-relative">
                    <Title my={'md'} order={4} align="center">Asso 1</Title>
                </Box>
            </section>

            <main className="tw-bg-white tw-rounded-t-3xl tw-w-full tw-min-h-[calc(100vh-242px)]">
                <Space h={'sm'} />
                <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
                    <Box className="tw-border-[1px] tw-border-gray-300 tw-shadow-sm tw-rounded-3xl" mx={'xs'} px={'md'} py={'md'}>
                            <Text fz={'sm'} mb={'sm'}>Nb offres: <span>3</span></Text>
                            <FileInput
                                className="placeholder:tw-text-red-500"
                                rightSection={<AiOutlineFileText className="tw-text-gray-800" size={18} />}
                                placeholder="Ajouter un fichier"
                                label="Statut"
                                withAsterisk
                                mb={'sm'}
                                {...form.getInputProps('statut')}/>
                            <List className="tw-list-disc" type="unordered" size={'sm'} mt={'md'}>
                                <List.Item className={hasEnoughOffers ? 'tw-text-emerald-600/80' : ''}>
                                    Vous avez au moins 3 offres</List.Item>
                                <List.Item className={hasUploadedStatus ? 'tw-text-emerald-600/80' : ''}>
                                    Vous avez joint vos statuts</List.Item>
                            </List>
                    </Box>
                    <Center>
                        <Button type="submit" size="xs" 
                                className="tw-border-[1px] tw-border-gray-300 tw-bg-white tw-text-gray-600 
                                tw-text-xs tw-rounded-3xl tw-px-10 tw-h-8 tw-mt-4 tw-mb-5 tw-shadow-md
                                hover:tw-bg-gray-200">
                                Envoyer pour  validation</Button>
                    </Center>
                </form>

                <Title align="center" color="white" order={6}
                    className="tw-bg-gray-400 tw-font-light tw-pb-1 tw-mt-4">Nouvelles offres de partenariat</Title>
                <AssociationPendingOffers offers={[fakeOffers[0]]} />

                <Title align="center" color="white" order={6}
                    className="tw-bg-orange-700 tw-font-light tw-pb-1 tw-mt-4">En attente de validation Pace&lsquo;Sport</Title>
                <AssociationPendingOffers offers={[fakeOffers[1]]} />

                <Title align="center" color="white" order={6}
                    className="tw-bg-green-600 tw-font-light tw-pb-1 tw-mt-4">Nouvelles offres de partenariat</Title>
                <AssociationPendingOffers offers={fakeOffers} />

            </main>

        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']

    
    let hasActiveSubscriptionRes = await fetch(`${process.env.API_URL}/api/user/hasActiveSubscription`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    hasActiveSubscriptionRes = await hasActiveSubscriptionRes.json();

    // if (hasActiveSubscriptionRes.data != null) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: "/profil/association/business",
    //         },
    //         props:{},
    //     };
    // }

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

    let cards = await fetch(`${process.env.API_URL}/api/discount-card/association/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    cards = await cards.json();

    let enseigne = await fetch(`${process.env.API_URL}/api/enseigne/auth/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    enseigne = await enseigne.json();
    
    let cancelUrl = context.req.headers.referer
    let stripe = await fetch(`${process.env.API_URL}/api/stripe/subscriptionLinks`, {
        method: 'POST',
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        }),
        body: JSON.stringify({
            cancelUrl: `${process.env.NEXT_URL}${context.resolvedUrl}`,
            baseUrl: `${process.env.NEXT_URL}`
        })
    })
    stripe = await stripe.json();

    let backgroundImage = await fetch(`${process.env.API_URL}/api/association/background`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
    backgroundImage = await backgroundImage.json();
    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        cards: JSON.parse(cards.data),
        hasFinishedTutorial: JSON.parse(enseigne.data).hasFinishedTutorial,
        stripeMonthPaymentLink: stripe.monthUrl,
        stripeYearPaymentLink: stripe.yearUrl,
        hasActiveSubscription: hasActiveSubscriptionRes.data == null ? false : true
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }