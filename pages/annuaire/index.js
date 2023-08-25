import { Avatar, Box, Center, Container, Flex, Modal, SimpleGrid, Stack, Text, Title,Button} from "@mantine/core"
import Layout from "./layout"
import { BsArrowLeft } from "react-icons/bs";
import Head from "next/head"
import { useContext, useState } from "react"
import { AppContext } from "@/context/AppContext"
import Link from 'next/link';
import SearchInput from "@/components/SearchInput"
import React from 'react';


export default function Page({user, users, query}) {
    const [opened, setOpened] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
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

    const ContactCards = users.map((user) => {
    const hasEnseigneOrAssociation = user.enseigne || user.association;

    // Si user.enseigne ou user.association est non null, créer la carte de contact
    if (hasEnseigneOrAssociation) {
       return ( 
        <Flex key={user.id} p={'sm'} onClick={() => modalHandler(true, user)}
            className="hover:tw-cursor-pointer hover:tw-bg-gray-100/50 hover:tw-shadow-inner tw-rounded-lg">
            <Avatar src={`uploads/${user.avatar?.name}`} radius={'xl'} size={'lg'} className="tw-shadow-lg" />
            <Center>
                <Text ml={'md'} fz={'lg'} weight={600} color="black" align="center">{user.prenom}</Text>
            </Center>
        </Flex>
       );
       }
    return null;
       });
    
    const ContactList = users.length == 0
        ? <Text align="center" color="dimmed">Aucune carte enregistrée</Text>
        : <Stack justify="flex-start" spacing="sm">{ContactCards}</Stack>


    return (
        <>
            <Head><title>Pace&lsquo;Sport - Annuaire</title></Head>
            <Box>
                <Flex m={'md'}>
                    <Center mr={'md'}>
                    </Center>
                    <SearchInput className='tw-flex-1' />
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
                    <Avatar src={`uploads/${currentUser?.avatar}`} radius={'xl'} size={'lg'} className="tw-shadow-lg" />
                </Flex>
                <SimpleGrid cols={2} p={'lg'} className="tw-bg-gray-100/70 tw-rounded-lg" mt={'lg'}
                      breakpoints={[
                        { maxWidth: 'md', cols: 1, spacing: 'md' }
                        ]}>
                    <InfoText title={'Nom'} value={currentUser?.name} />
                    <InfoText title={'Prénom'} value={currentUser?.prenom} />
                    <InfoText title={'E-mail'} value={currentUser?.email} />
                    <InfoText title={'Téléphone'} value={currentUser?.phone} />
                    <InfoText title={'Association'} value={currentUser?.association?.name} />
                    <InfoText title={'Enseigne'} value={currentUser?.enseigne?.name} />
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
  
    // // Pass data to the page via props
    return { props: {
        user: JSON.parse(userData.data),
        users: JSON.parse(data.data),
        query: context.query
    } }
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}