import { ActionIcon, Box, Button, Flex, Image, Space, Text, Title } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { BsLock, BsArrowLeft } from 'react-icons/bs'
import Layout from "@/components/layout/GradientDoodle"
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { FiArrowLeft, FiSettings } from "react-icons/fi";


const LinkButton = ({ text, href, lock, className, onClick }) => {
    const router = useRouter()
    const logout = () => {
        console.log('hello')
        deleteCookie('token_v2')
        router.push('/login')
    }
    const context = useContext(AppContext)
    const link = text == 'Déconnexion'
        ? <Button
            onClick={text == 'Déconnexion'
                ? () => logout()
                : () => context.setRole(text?.toString().toLowerCase())}
            className={`
                        tw-w-full 
                        ${text == 'Déconnexion'
                    ? ' tw-bg-[#d61515] tw-text-white hover:tw-bg-[#d61515] hover:tw-text-gray-100'
                    : ' tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800'}
                        `}
            radius='lg'>
            {text}
            {lock && <BsLock className='tw-text-[#d61515] tw-my-auto tw-ml-1' />}
        </Button>
        : <Link href={href}
            className={`
                tw-w-full ${className}
                ${href == '#' ? ' tw-text-gray-400' : ''}
            `}>
            <Button
                onClick={text == 'Déconnexion'
                    ? () => logout()
                    : () => context.setRole(text?.toString().toLowerCase())}
                className={`
                            tw-w-full 
                            ${text == 'Déconnexion'
                        ? ' tw-bg-[#d61515] tw-text-white hover:tw-bg-[#d61515] hover:tw-text-gray-100'
                        : ' tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800'}
                            `}
                radius='lg'>
                {text}
                {lock && <BsLock className='tw-text-[#d61515] tw-my-auto tw-ml-1' />}
            </Button>
        </Link>
    return (
        <>
            {link}
        </>
    )
}

const Logo = ({ previousUrl }) => (
    <>
        <Box align='center' className="tw-relative -tw-top-16 tw-h-[70px]">
            <Link href='/login' className="tw-h-[70px]">
                <Image src={'/logo.png'} width={86} alt="Logo Pace'sport"
                    className='tw-rounded-full shadow-sm tw-bg-white tw-p-2 tw-z-20' />
            </Link>

            <ActionIcon component="a" href={`${previousUrl == 'undefined' ? '/login/as' : previousUrl}`} radius={'xl'} size={'lg'}
                className="tw-bg-white tw-text-gray-900 tw-absolute tw-left-4 tw-top-16">
                <FiArrowLeft />
            </ActionIcon>
        </Box>
    </>
)

export default function Page({ status }) {
    const router = useRouter()
    const context = useContext(AppContext)
    const logout = () => {
        deleteCookie('token_v2')
        router.push('/login')
    }
    return (
        <>
            <Head><title>Pace'sport - connexion</title></Head>

            <header>
                <Space my={'xl'} pt={'xl'} h={'xl'} />
            </header>
            <Box className="tw-rounded-3xl tw-relative" pt={'xl'} m={'lg'} bg={'dark'} >

                <Link href="/login/as">
                    <Button variant="filled" size="sm"
                        className="tw-bg-gray-50 tw-ml-5 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full"
                        radius={'xl'}><BsArrowLeft /></Button></Link>

                <Title order={6} align="center" transform="uppercase" weight={600} color="white">
                    Paramètres</Title>
                <Flex justify='center' direction='column' mb='lg' p={'xl'} mx={'md'} gap="xl">
                    <Flex justify='center' direction='column' my='xs' py={'sm'} gap="xs">
                        <LinkButton className={''} text='Mes informations' href={'/informations'} />
                        <Space my={'xs'} />
                        <Space my={'xs'} />
                        <LinkButton className={''} text="Conditions d'utilisation" href={'/conditions-generales-utilisation'} />
                        <LinkButton className={''} text='Conditions générales de vente' href={'/conditions-generales-vente'} />
                        <LinkButton className={''} text='Politique de confidentialité' href={'/politique-de-confidentialite'} />
                        <Space my={'xs'} />
                    </Flex>
                    <LinkButton className={''} text='Déconnexion' href={''} onClick={() => logout()} />
                </Flex>
            </Box>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token_v2']
    const res = await fetch(`${process.env.API_URL}/api/account/is-signup-complete`, {
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

    // // Pass data to the page via props
    return {
        props: {
            status: data.data
        }
    }
}

Page.getLayout = function getLayout(page) {
    return (
        <Layout isLogoVisible={false}>{page}</Layout>
    )
}