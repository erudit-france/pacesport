import { ActionIcon, Box, Button, Center, CopyButton, FileInput, Flex, Group, Image, Modal, ScrollArea, Space, Stack, Table, Tabs, Text, TextInput, Title, Tooltip } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getUser, getUsers } from "@/domain/repository/UserRepository";
import UserRoleBadge from "@/components/UserRoleBadge";
import { TbCopy, TbCheck } from "react-icons/tb"
import { useState } from "react";
import { RxInfoCircled } from "react-icons/rx";
import { getPacesportCard } from "@/domain/repository/PacesportRepository";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

export default function Page(props){
    const pacesportCard = props.pacesportCard
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const refresh = () => { router.reload(window.location.pathname) }
    const [logo, setLogo] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    
    const handleLogo = (file) => {
        const url = URL.createObjectURL(file)
        setLogo(url)
        setLogoFile(file)
    }

    const createPacesportCard = () => {
        setLoading(true)
        fetch(`/api/discount-card-pacesport/initiate`, {
            method: 'POST',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            })
          })
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.info(res.data.message)
                refresh()
            }
          })
        .catch((error) => { 
            Toast.error('Erreur pendant la création') 
            setLoading(false)
        })
    }

    const imageUploadHandler = async () => {
        if (logoFile == null) return
        setLoading(true)
        const formData = new FormData()
        formData.append('file', logoFile)
        let avatar = await fetch(`/api/file/upload`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: formData
        })
        avatar = await avatar.json()
        if (avatar.code == 401) {
            Toast.error('session expirée')
            router.push('/login')
            return
        }

        let body = new FormData()
        body.append('logo', avatar.data.filename)
        fetch(`/api/discount-card-pacesport/update`, {
            method: 'POST',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: body
          })
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.info(res.data.message)
                refresh()
            }
          })
        .catch((error) => { 
            Toast.error('Erreur pendant la mise à jour') 
            setLoading(false)
        })
    }

    const PacesportCard = ({card}) => {
        if (!card) return <></>
        let src = '/logo.png'
        if (card.image) {
            src = `/uploads/${card.image.name}`
        }
        return (
            <Center>
                <Box className="tw-rounded-xl tw-shadow-lg tw-relative">
                    <Image
                        className="tw-absolute tw-z-20 tw-right-1 tw-opacity-80 -tw-translate-y-1/2 tw-top-1/2"
                        width={24}
                        height={24}
                        src={`/sim.png`}
                        alt="logo sim"
                    />
                    <Image
                    className="tw-opacity-95"
                    radius={'lg'}
                    width={200}
                    height={110}
                    src={`${src}`}
                    alt="Photo de campagne"
                    withPlaceholder
                    />
                </Box>
            </Center>
        )
    }

    const createPacesportButton = <Center mt={'md'}>
        <Button 
            disabled={loading}
            onClick={() => createPacesportCard()}
            className="tw-bg-red-600" variant="filled"
            color="red" size="sm" radius={'lg'}
            >Créer la carte</Button>
    </Center>
    
    return (
        <>
            <ScrollArea className="tw-max-w-[100%]">
                <Tabs.Panel value="carte" p={"md"}>
                    <Title order={6}>Paramètre carte Pace{"'"}Sport</Title>
                    {!pacesportCard && createPacesportButton}
                    <Space my={'lg'} />
                    {pacesportCard &&
                        <>
                            <PacesportCard card={pacesportCard} />
                            <FileInput
                                mt={"md"}
                                placeholder="Choisir une image"
                                label="Modifier image"
                                withAsterisk
                                onChange={handleLogo}
                                ccept="image/png,image/jpeg" />
                            <Group position="right">
                                <Button onClick={() => imageUploadHandler()} 
                                    disabled={loading}
                                    size="xs" mt={'sm'} className="tw-bg-blue-600">Valider</Button>
                            </Group>
                        </>
                    }
                </Tabs.Panel>
            </ScrollArea>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let user = await getUser(token)
    user = JSON.parse(user.data)
    if (!user.roles.includes('ROLE_ADMIN')) {
        return {
            redirect: {
            permanent: false,
            destination: "/login/as"
            }
        }
    }
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

    let backgroundImage = await fetch(`${process.env.API_URL}/api/association/background`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
    backgroundImage = await backgroundImage.json();

    let pacesport = await getPacesportCard(token)


    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        pacesportCard: JSON.parse(pacesport.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }