import { Avatar, Box, Center, Container, Flex, Modal, SimpleGrid, Stack, Text, Title,Button} from "@mantine/core"
import { getCardActiveOffers, getAssociationPendingOffers, getAssociationPacesportPendingOffers } from "@/domain/repository/CardOffersRepository";
import Layout from "./layout"
import { BsArrowLeft } from "react-icons/bs";
import Head from "next/head"
import { useContext, useState } from "react"
import { AppContext } from "@/context/AppContext"
import Link from 'next/link';
import SearchInput from "@/components/SearchInput"
import React from 'react';


export default function Page({user, users, query, activeOffers2, pacesportPendingOffers2, pendingOffers2}) {
    const [opened, setOpened] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [activeOffers, setActiveOffers] = useState(activeOffers2)
    const [pendingOffers, setPendingOffers] = useState(pendingOffers2)
    const [pacesportPendingOffers, setPacesportPendingOffers] = useState(pacesportPendingOffers2)
    const modalHandler = (state, user) => {
        setOpened(state)
        setCurrentUser(user)
    }
    const InfoText = ({title, value}) => (
        <SimpleGrid cols={2}>
            <Text fz={'sm'} className="tw-font-semibold">{title}</Text>
            <Text fz={'sm'}>{value || '-'}</Text>
        </SimpleGrid>
    )
console.log(users)

let ContactCards = '';

if(query.prev == "/profil/association")
{
    const uniqueOffers = activeOffers.filter((offer, index, self) =>
    index === self.findIndex((o) => o.enseigne?.id === offer.enseigne.id)
);
    ContactCards = uniqueOffers.map((offer) => {
        return (
            <Flex key={offer.enseigne.id} p={'sm'} onClick={() => modalHandler(true, offer.enseigne)}
            className="hover:tw-cursor-pointer hover:tw-bg-gray-100/50 hover:tw-shadow-inner tw-rounded-lg">
            <Avatar src={`uploads/${offer.enseigne.avatar?.name}`} radius={'xl'} size={'lg'} className="tw-shadow-lg" />
            <Center>
                <Text ml={'md'} fz={'lg'} weight={600} color="black" align="center">{offer.enseigne.name}</Text>
            </Center>
        </Flex>
        );
    })
}
else{
    ContactCards = users.map((offer) => { if(offer.association?.id){
        return (
            <Flex key={offer.association.id} p={'sm'} onClick={() => modalHandler(true, offer.association)}
            className="hover:tw-cursor-pointer hover:tw-bg-gray-100/50 hover:tw-shadow-inner tw-rounded-lg">
            <Avatar src={`uploads/${offer.association.avatar?.name}`} radius={'xl'} size={'lg'} className="tw-shadow-lg" />
            <Center>
                <Text ml={'md'} fz={'lg'} weight={600} color="black" align="center">{offer.association.name}</Text>
            </Center>
        </Flex>
        );}
    })
    }
    const ContactList = users.length == 0
        ? <Text align="center" color="dimmed">Aucune carte enregistrée</Text>
        : <Stack justify="flex-start" spacing="sm">{ContactCards}</Stack>

    return (
        <>
            <Head><title>Pace'Sport - Annuaire</title></Head>filter
            <Box>
                <Flex m={'md'}>
                    <Center mr={'md'}>
                    </Center>
                    <SearchInput className={query.prev == "/profil/association" ? 'tw-flex-1 spo' : 'tw-flex-1'} />
                </Flex>
                <Container m={'lg'} p={'lg'} className="tw-border-[1px] tw-border-gray-200 tw-rounded-xl tw-bg-gray-50/50">
                    {ContactList}
                </Container>
            </Box>
            <Modal centered
                size="calc(100vw - 1%)"
                opened={opened}
                onClose={() => modalHandler(false, null)}
                title="Détails"
                radius={'lg'}
            >
                <Flex className="">
                    <Avatar src={`uploads/${currentUser?.avatar.name}`} radius={'xl'} size={'lg'} className="tw-shadow-lg" />
                </Flex>
                <SimpleGrid cols={2} p={'lg'} className="tw-bg-gray-100/70 tw-rounded-lg" mt={'lg'}
                      breakpoints={[
                        { maxWidth: 'md', cols: 1, spacing: 'md' }
                        ]}>
                    <InfoText title={query.prev == "/profil/association" ? 'Nom de l\'enseigne' : 'Nom de l\'association'} value={currentUser?.name} />
                    <InfoText title={'Adresse'} value={currentUser?.address} />
                    <InfoText title={'E-mail'} value={currentUser?.email} />
                    <InfoText title={'Téléphone'} value={currentUser?.phone} />
                    
                </SimpleGrid>
            </Modal>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    const res = await fetch(`${process.env.API_URL}/api/chat/users`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
      )
    const data = await res.json()
  
    if(data.code == 401) 
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }

    const user = await fetch(`${process.env.API_URL}/api/user`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
        )
    const userData = await user.json()
    
    let url = context.req.headers.referer
    let previousUrl = url === undefined ? '/messages/' : url
    let activeOffers = await getCardActiveOffers(token)
    let pendingOffers = await getAssociationPendingOffers(token)
    let pacesportPendingOffers = await getAssociationPacesportPendingOffers(token)
    // // Pass data to the page via props
    return { props: {
        user: JSON.parse(userData.data),
        users: JSON.parse(data.data),
        activeOffers2: JSON.parse(activeOffers.data),
        pendingOffers2: JSON.parse(pendingOffers.data),
        pacesportPendingOffers2: JSON.parse(pacesportPendingOffers.data),
        query: context.query
    } }
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}