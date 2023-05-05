import { Avatar, Box, Center, Container, Flex, Stack, Text, Title } from "@mantine/core"
import Layout from "./layout"
import Head from "next/head"
import { useContext } from "react"
import AppContext from "@/context/AppContext"
import PreviousPageButton from "@/components/PreviousPageButton"
import SearchInput from "@/components/SearchInput"



export default function Page({user, users, query}) {
    const ContactCards = users.map((user) => 
        <Flex key={user.id}>
            <Avatar src={`uploads/${user.avatar?.name}`} radius={'xl'} size={'lg'} className="tw-shadow-lg" />
            <Center>
                <Text ml={'md'} fz={'lg'} weight={600} color="black" align="center">{user.prenom}</Text>
            </Center>
        </Flex>
    )
    
    const ContactList = users.length == 0
        ? <Text align="center" color="dimmed">Aucune carte enregistrée</Text>
        : <Stack justify="flex-start" spacing="sm">{ContactCards}</Stack>


    return (
        <>
            <Head><title>Pace&lsquo;Sport - Annuaire</title></Head>
            <Box>
                <Flex m={'md'}>
                    <Center mr={'md'}>
                        <PreviousPageButton href={query.prev || ''} />
                    </Center>
                    <SearchInput className='tw-flex-1' />
                </Flex>
                <Container>{ContactList}</Container>
            </Box>
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
        previousUrl: previousUrl,
        query: context.query
    } }
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}