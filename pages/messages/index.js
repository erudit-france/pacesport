import { Avatar, Center, Flex, Indicator, Modal, Paper, ScrollArea, Text, Button, Select } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";;
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import { getCookie } from "cookies-next";
import Head from "next/head"
import Link from "next/link";
import { useEffect, useState } from "react";
import { RxPerson } from "react-icons/rx";
import ContactList from "./components/ContactList";
import SearchUser from "./components/SearchUser";
import Layout from "./layout"
import { FiArrowRight, FiPlus } from 'react-icons/fi'
import axios from "axios";
;

const UsersCard = ({ users }) => {
    const items = users.length == 0
        ? <Text align='center'>Aucun utilisateur</Text>
        : users.map((user) => (
            <Flex key={String(user.id)} justify='space-between' my={'sm'}>
                <Flex direction={"row"}>
                    <Avatar radius={'xl'} className="tw-shadow-md" />
                    <Text className='tw-my-auto tw-ml-2 tw-font-semibold tw-text-gray-700'>{user.nom} {user.prenom}</Text>
                </Flex>
                <Flex direction={'column'} justify='center' align={'center'}>
                    <Link href='' className="tw-bg-teal-600 tw-rounded-full tw-p-2">
                        <FiArrowRight size={18} className=" tw-bg-teal-600 tw-rounded-full tw-text-white" />
                    </Link>
                </Flex>
            </Flex>
        ));
    return (
        <>{items}</>
    )
}

const ChatHeader = ({ previousUrl }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        async function fetchData() {
            //   setLoading(true)
            const res = await axios(
                '/api/chat/users',
                { headers: { 'JWTAuthorization': `Bearer ${getCookie('token')}` } }
            );

            setUsers(JSON.parse(res.data.data))
            //   setLoading(false)
        }
        fetchData()
    }, []);

    return (
        <>
            <div className="tw-mb-4">
                <Flex justify={'space-between'}>
                    <Center mr={'md'}>
                    </Center>
                    {/* <Link href={'/annuaire?prev=/messages'}
                        className='tw-text-sm tw-border-[1px] tw-bg-white tw-px-3 tw-py-1.5 tw-rounded-2xl
                                tw-border-gray-300 hover:tw-bg-gray-50'>
                        Annuaire
                    </Link> */}
                    {/* <Link href={''} 
                        className='tw-text-sm tw-border-[1px] tw-px-3 tw-py-1.5 tw-rounded-2xl
                                tw-border-gray-300 hover:tw-bg-gray-50 tw-flex'>
                    
                        Groupe
                        <Center  className="tw-ml-1"><FiPlus/></Center>
                    </Link> */}
                </Flex>
            </div>
            <script dangerouslySetInnerHTML={{
                __html: `
            // Attacher un gestionnaire d'événements au bouton
            document.getElementById('goBackButton').addEventListener('click', function() {
                // Appeler la fonction pour revenir en arrière dans l'historique
                window.history.back();
            });
        `}} />
            <Modal opened={opened} onClose={close} title="Liste des utilisateurs" centered>
                <UsersCard users={users} />
            </Modal>
        </>
    )
}

export default function Page(props) {
    const [title, setTitle] = useState('Pace\'Sport - Messages');
    useDocumentTitle(title);
    console.log(title)

    // const [chatRooms, setChatRooms] = useState([]);
    // useEffect(() => {
    //     async function fetchData(){
    //       //   setLoading(true)
    //         const res = await axios(
    //             '/api/chat/rooms',
    //             {headers: { 'JWTAuthorization': `Bearer ${getCookie('token')}`}}
    //         );

    //         setChatRooms(JSON.parse(res.data.data))
    //       //   setLoading(false)
    //       }
    //       fetchData()
    //   }, []);


    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <section className="tw-mx-3 tw-pt-4">
                <Paper className="tw-py-4 tw-bg-transparent tw-p-2 tw-rounded-lg">
                    <ChatHeader previousUrl={props.previousUrl} />
                </Paper>
                {/* <Select className="tw-m-1.5 tw-my-3" 
   // value={value}
    data={props.user}
    //onChange={handleChange} 
    /> */}
                <ScrollArea className="tw-bg-white/10 tw-p-2 tw-py-5 tw-rounded-3xl tw-mt-2"
                    offsetScrollbars
                    style={{ height: 'calc(100vh - 290px)' }}>
                    <ContactList chatRooms={props.chatRooms} />
                </ScrollArea>
            </section>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    const res = await fetch(`${process.env.API_URL}/api/chat/rooms`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    const data = await res.json()

    if (data.code == 401)
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }

    const user = await fetch(`${process.env.API_URL}/api/user`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    const userData = await user.json()
    let url = context.req.headers.referer
    let previousUrl = url === undefined ? '/login/as/' : url

    // // Pass data to the page via props
    return {
        props: {
            chatRooms: JSON.parse(data.data),
            user: JSON.parse(userData.data)
        }
    }
}

Page.getLayout = function getLayout(page) {
    return (
        <Layout>{page}</Layout>
    )
}