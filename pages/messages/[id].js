import { Avatar, Box, Button, Flex, ScrollArea, Skeleton, Text, TextInput } from "@mantine/core"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "./layout"
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'
import ChatMessage from "./components/ChatMessage"
import moment from "moment/moment"
import 'moment/locale/fr'
import { useEffect, useState } from "react"
import { getCookie } from "cookies-next"
import { useForm } from "@mantine/form"
import { FiArrowRight } from 'react-icons/fi'
import { serialize } from "object-to-formdata"
import { AiOutlineFile } from "react-icons/ai"
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material"

const ChatHeader = () => {
    const router = useRouter()
    const contactId = router.query.id
    const [user, setUser] = useState({});
    useEffect(() => {
        if (contactId === undefined) return
        fetch(`/api/chat/users/chatRoom?id=${contactId}`, {
            method: 'GET',
            headers: new Headers({
            'JWTAuthorization': `Bearer ${getCookie('token')}`,
            'Content-Type': 'application/json'
            })
        })
        .then(res => res.json())
        .then(res => setUser(res.data))
        .catch(err => console.log(err))
    }, [contactId])

    if (user.code == 401) router.push('/login')
    const names = user[0];
    return (
        <header className="tw-shadow-sm tw-py-1">
            <Flex mx={'md'} justify={"space-between"} className="tw-relative">
                <Link className="tw-rounded-md tw-px-3
                        tw-border-[1px] tw-border-gray-700 tw-text-gray-900
                        hover:tw-text-gray-50 hover:tw-bg-gray-900 hover:tw-border-white
                        hover:" 
                        href={'/messages'}>
                    <HiOutlineArrowNarrowLeft size={'1.6rem'}/></Link>
                    {user && 
                        <Text className="tw-text-center tw-font-semibold tw-absolute
                        tw-left-1/2 -tw-translate-x-1/2 tw-top-0.5" 
                        >{names}</Text>
                    }
                    {!user &&
                        <Skeleton height={8} mt={6} width="70%" radius="xl" />}
                <Avatar className="tw-shadow-md tw-bg-contain" radius={'xl'} size={'sm'} src={user.logo} />
            </Flex>
        </header>
    )
}

const actions = [
    { icon: <AiOutlineFile />, name: 'Fichier' }
];
  
const BasicSpeedDial = () => {
    return (
      <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </Box>
    );
  }

export default function Page(props) {
    const router = useRouter()
    const contactId = router.query.id

    const [messages, setMessages] = useState([])
    useEffect(() => {
        if (contactId === undefined) return
        fetch(`/api/chat/messages?id=${contactId}`, {
            headers: new Headers({
            'JWTAuthorization': `Bearer ${getCookie('token')}`,
            }),
        })
        .then(res => res.json())
        .then(res => setMessages(JSON.parse(res.data)))
    }, [contactId])
    

    const form = useForm({
        initialValues: {
            chatRoomId: contactId,
            message: '',
        },
        validate: {
          message: (value) => (value != '' ? null : 'Veuillez saisir un message'),
        },
    });
    
    const submitChat = (values) => {
        const body = serialize(values);
        body.append('chatRoomId', contactId)
        fetch(`/api/chat`, {
            body: body,
            method: 'POST',
            headers: new Headers({
            'JWTAuthorization': `Bearer ${getCookie('token')}`,
            }),
        })
        .then(res => res.json())
        .then(res => {
            console.log('res', res.data)
            form.values.message = ''
            setMessages([...messages, JSON.parse(res.data)])
        })
    }


    return (
        <>
            <Head>
                <title>Pace&lsquo;Sport - USERNAME</title>
            </Head>
            <section className="tw-mx-2 tw-pt-2 tw-bg-white tw-rounded-t-3xl tw-top-2 tw-relative"
                    style={{ height: 'calc(100vh - 170px)' }}>
                    <ChatHeader  />
                    <ScrollArea className="tw-p-2" 
                                style={{ height: 'calc(100vh - 286px)' }}
                                offsetScrollbars>
                                {messages.map((message,i) => (
                                    <ChatMessage message={message} key={i}/>
                                ))}
                    </ScrollArea>
                    <form onSubmit={form.onSubmit((values) => submitChat(values))}>
                        <Flex justify={'space-between'} pos={'relative'}>
                            <TextInput radius='lg' placeholder="message" 
                                    className="tw-flex-grow tw-ml-3"
                                    {...form.getInputProps('message')}/>
                            <Button type="submit" className=" tw-absolute tw-right-14 hover:tw-bg-transparent">
                                <FiArrowRight size={30} className=" tw-bg-teal-600 tw-p-1 tw-rounded-full tw-text-white" />
                            </Button>
                            <BasicSpeedDial />
                        </Flex>
                    </form>
            </section>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']


    const user = await fetch(`${process.env.API_URL}/api/user`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
        )
    const userData = await user.json()

    if(userData.code == 401) 
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }

    // // Pass data to the page via props
    return { props: { 
        user: JSON.parse(userData.data),
    } }
}


Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}