import { Avatar, Flex, Indicator, Modal, Paper, ScrollArea, Text } from "@mantine/core";
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import { getCookie } from "cookies-next";
import Head from "next/head"
import Link from "next/link";
import { useEffect, useState } from "react";
import { RxPerson } from "react-icons/rx";
import ContactList from "./components/ContactList";
import SearchUser from "./components/SearchUser";
import Layout from "./layout"
import { FiArrowRight } from 'react-icons/fi'
import axios from "axios";

const UsersCard = ({users}) => {
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

const ChatHeader = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [users, setUsers] = useState([]);
    useEffect(() => {
      async function fetchData(){
        //   setLoading(true)
          const res = await axios(
              '/api/chat/users',
              {headers: { 'JWTAuthorization': `Bearer ${getCookie('token')}`}}
          );
  
          setUsers(JSON.parse(res.data.data))
        //   setLoading(false)
        }
        fetchData()
    }, []);

    return (
        <>
            <div className="tw-mb-4">
                <Link href={''} onClick={open}
                    className='tw-text-sm tw-border-[1px] tw-px-3 tw-py-1.5 tw-rounded-2xl
                            tw-border-gray-300 hover:tw-bg-gray-50'>
                    Annuaire
                </Link>
            </div>
            
            <Modal opened={opened} onClose={close} title="Liste des utilisateurs" centered>
                <UsersCard users={users}/>
            </Modal>
        </>
    )
}

export default function Page(){
    const [title, setTitle] = useState('Pace\'Sport - Messages');
    useDocumentTitle(title);
    
    const [chatRooms, setChatRooms] = useState([]);
    useEffect(() => {
        async function fetchData(){
          //   setLoading(true)
            const res = await axios(
                '/api/chat/rooms',
                {headers: { 'JWTAuthorization': `Bearer ${getCookie('token')}`}}
            );
    
            setChatRooms(JSON.parse(res.data.data))
          //   setLoading(false)
          }
          fetchData()
      }, []);


    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <section className="tw-mx-3 tw-pt-4">
                <Paper className="tw-py-4 tw-bg-white tw-p-2 tw-rounded-lg">
                    <ChatHeader />
                    <SearchUser />
                </Paper>
                <ScrollArea className="tw-bg-white tw-p-2 tw-py-5 tw-rounded-3xl tw-mt-2" 
                    offsetScrollbars
                    style={{ height: 'calc(100vh - 220px)' }}>
                    <ContactList chatRooms={chatRooms} />
                </ScrollArea>
            </section>
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}