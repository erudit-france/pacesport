import { Avatar, Box, Button, Center, CloseButton, FileButton, Flex, Group, Image, Modal, ScrollArea, Skeleton, Text, TextInput } from "@mantine/core"
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
import { Slider, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material"
import { useInterval } from "@mantine/hooks"
import Toast from "@/services/Toast"

const ChatHeader = () => {
    const router = useRouter()
    const contactId = router.query.id
    const [user, setUser] = useState({})
    useEffect(() => {
        if (contactId === undefined) return
        fetch(`/api/chat/users/chatRoom?id=${contactId}`, {
            method: 'GET',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`,
                'Content-Type': 'application/json'
            })
        })
            .then(res => res.json())
            .then(res => {
                // setUser(res.data)
            })
            .catch(err => console.log(err))
        fetch(`/api/chat/get/infos/users/chatRoom?id=${contactId}`, {
            method: 'GET',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`,
                'Content-Type': 'application/json'
            })
        })
            .then(res => res.json())
            .then(res => {

                var resultaChatData = JSON.parse(res.data)
                if (resultaChatData.name != null) {
                    setUser(resultaChatData.name)
                } else {
                    resultaChatData.users.forEach(element => {
                        if (element.id != user.id) {
                            setUser(element.nom)
                            if (element.association == null) {
                                setUser(element.enseigne.name)
                            } else {
                                setUser(element.association.name)
                            }
                        }
                    });
                }
                // setUser(resultaChatData.data)
            })
            .catch(err => console.log(err))
    }, [contactId])

    const names = user;
    console.log(user)
    return (
        <header className="tw-shadow-sm tw-py-1">
            <Flex mx={'md'} justify={"space-between"} className="tw-relative">
                <Link className="tw-rounded-md tw-px-3
                        tw-border-[1px] tw-border-gray-700 tw-text-gray-900
                        hover:tw-text-gray-50 hover:tw-bg-gray-900 hover:tw-border-white
                        hover:"
                    href={'/messages'}>
                    <HiOutlineArrowNarrowLeft size={'1.6rem'} /></Link>
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



export default function Page(props) {
    const [previewImage, setPreviewImage] = useState(null)
    const router = useRouter()
    const contactId = router.query.id
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [messages, setMessages] = useState([])
    const interval = useInterval(() => fetchChat(), 8000)
    const imagePreviewHandler = (image) => {
        setPreviewImage(image)
    }

    const attachmentHandler = (file) => {
        if (file == null) {
            setAttachment(null)
            setAttachmentPreview(null)
            return
        }
        setAttachment(file)
        const url = URL.createObjectURL(file)
        setAttachmentPreview(url)
    }

    const fetchChat = () => {
        if (contactId === undefined) return
        fetch(`/api/chat/messages?id=${contactId}`, {
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`,
            }),
        })
            .then(res => res.json())
            .then(res => setMessages(JSON.parse(res.data)))
    }

    useEffect(() => {
        interval.start();
        if (contactId === undefined) return
        fetch(`/api/chat/messages?id=${contactId}`, {
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`,
            }),
        })
            .then(res => res.json())
            .then(res => setMessages(JSON.parse(res.data)))
        return interval.stop;
    }, [contactId])


    const form = useForm({
        initialValues: {
            chatRoomId: contactId,
            message: '',
        },
        validate: {
            message: (value) => {
                if (value == '') {
                    // permettre l'envoi de fichier sans message
                    if (attachment != null) {
                        return null
                    }
                    return 'Veuillez saisir un message'

                }
            },
        },
    });

    const submitChat = (values) => {
        if (attachment) {
            const formData = new FormData()
            formData.append('file', attachment)
            fetch(`/api/file/upload`, {
                method: 'POST',
                type: 'cors',
                headers: new Headers({
                    'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
                }),
                body: formData
            })
                .then(res => res.json())
                .then(res => {
                    const body = serialize(values);
                    if (res.data.code == 1) {
                        body.append('filename', res.data.filename)
                    }
                    fetch(`/api/chat`, {
                        body: body,
                        method: 'POST',
                        headers: new Headers({
                            'JWTAuthorization': `Bearer ${getCookie('token_v3')}`,
                        }),
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (res.code == 401) {
                                Toast.error('Session expirée')
                                router.push('/login')
                                return
                            }
                            form.values.message = ''
                            setMessages([...messages, JSON.parse(res.data)])
                        })
                    attachmentHandler(null)
                })
                .catch((error) => {
                    console.log('error', error)
                    Toast.error('Erreur pendant le téléchargement de l\'image')
                })
        } else {
            // saving chat without attachment
            const body = serialize(values);
            fetch(`/api/chat`, {
                body: body,
                method: 'POST',
                headers: new Headers({
                    'JWTAuthorization': `Bearer ${getCookie('token_v3')}`,
                }),
            })
                .then(res => res.json())
                .then(res => {
                    if (res.code == 401) {
                        Toast.error('Session expirée')
                        router.push('/login')
                        return
                    }
                    form.values.message = ''
                    setMessages([...messages, JSON.parse(res.data)])
                })
            attachmentHandler(null)
        }
    }

    const BasicSpeedDial = <Box className="tw-relative tw-w-[36px]"
        sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{
                position: 'absolute', bottom: 0, right: 8, height: 36, width: 36,
                '& .MuiButtonBase-root': { width: 36, backgroundColor: '#077067' },
                '& .MuiSpeedDialAction-fab': { backgroundColor: '#1a8f85' },
            }}
            icon={<SpeedDialIcon size={12} />}
        >
            <FileButton onChange={(file) => attachmentHandler(file)} accept="image/png,image/jpeg,file">
                {(props) =>
                    <SpeedDialAction
                        {...props}
                        key={'Fichier'}
                        icon={<AiOutlineFile color="white" />}
                        tooltipTitle={'Fichier'}
                    />
                }
            </FileButton>
        </SpeedDial>
    </Box>

    const AttachmentPreview = () => {
        const filename = attachment.name
        const isImage = (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(filename)
        if (isImage) {
            return (
                <Box className="tw-h-[90px] tw-w-full tw-bg-gray-100/50 tw-p-1 tw-px-4">
                    <Group className="">
                        <Group className="tw-relative">
                            <CloseButton aria-label="Supprimer image"
                                onClick={() => attachmentHandler(null)}
                                className="tw-absolute -tw-right-3 -tw-top-1 tw-z-40 tw-bg-white tw-rounded-3xl tw-shadow-md tw-border-[1px] tw-border-gray-300/40" color="dark" />
                            <Image src={attachmentPreview} height={85} alt="Preview de l'image à télécharger" />
                        </Group>
                    </Group>
                </Box>
            )
        } else {
            return (
                <Box className="tw-h-[90px] tw-w-full tw-bg-gray-100/50 tw-p-1 tw-px-4">
                    <Link className="tw-text-[.92rem] tw-text-blue-500 tw-underline" href={``}>{filename}</Link>
                </Box>
            )
        }
    }

    return (
        <>
            <Head>
                <title>Pace'Sport - USERNAME</title>
            </Head>
            <section className="tw-mx-2 tw-pt-2 tw-bg-white tw-rounded-t-3xl tw-top-2 tw-relative"
                style={{ height: 'calc(100vh - 170px)' }}>
                <ChatHeader />
                <ScrollArea className="tw-p-2"
                    style={{
                        height:
                            attachmentPreview ? 'calc(100vh - 340px)' : 'calc(100vh - 280px)'
                    }}
                    offsetScrollbars>
                    {messages.map((message, i) => (
                        <ChatMessage setPreviewImage={imagePreviewHandler} message={message} key={i} />
                    ))}
                </ScrollArea>
                <form className="tw-relative"
                    onSubmit={form.onSubmit((values) => submitChat(values))}>
                    {attachmentPreview &&
                        <AttachmentPreview />
                    }
                    <Flex>
                        <Box className="tw-max-w-[calc(100vw-80px)]">
                            <TextInput radius='lg' placeholder="message"
                                className="tw-ml-3 tw-w-[calc(100vw-80px)]"
                                {...form.getInputProps('message')} />
                            <Button type="submit" className=" tw-absolute tw-right-[3.8rem] tw-bottom-0 tw-p-0 hover:tw-bg-transparent">
                                <FiArrowRight size={30} className=" tw-bg-teal-600 tw-p-1 tw-rounded-full tw-text-white" />
                            </Button>
                        </Box>
                        {BasicSpeedDial}
                    </Flex>
                </form>
                <Modal
                    opened={previewImage}
                    onClose={() => setPreviewImage(false)}
                    title={<Text color="white" fz={'xs'}>{previewImage ? previewImage.name : ''}</Text>}
                    fullScreen
                    styles={{
                        modal: { backgroundColor: '#0e0e0ee5' },
                        header: { marginTop: '30px' },
                    }}
                >
                    {previewImage &&
                        <Center className="tw-h-full">
                            <Image width={'90%'} src={`/uploads/${previewImage.name}`} alt={previewImage.name} />
                        </Center>
                    }

                </Modal>
            </section>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token_v3']


    const user = await fetch(`${process.env.API_URL}/api/user`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    const userData = await user.json()
    console.log('userData', userData)
    if (userData.code == 401)
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }

    // // Pass data to the page via props
    return {
        props: {
            user: JSON.parse(userData.data),
        }
    }
}


Page.getLayout = function getLayout(page) {
    return (
        <Layout>{page}</Layout>
    )
}