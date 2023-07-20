import { ActionIcon, Box, Button, Flex, Image, Space, Text, Title } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { BsLock } from 'react-icons/bs'
import Layout from "@/components/layout/GradientDoodle"
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { FiSettings } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";

const LinkButton = ({text, href, lock, className, onClick}) => {
    const router = useRouter()
    const logout = () => {
        deleteCookie('token')
        router.push('/home')
    }
    const context = useContext(AppContext)
    return (
        <Link href={href} 
            className={`tw-w-full ${className}`}
            onClick={text == 'Déconnexion' 
                        ? logout
                        : () => setCookie('role', text?.toLowerCase())}
            >
            <Button 
                className={`
                            tw-w-full 
                            ${text == 'Déconnexion' 
                                ? ' tw-bg-red-800 tw-text-white hover:tw-bg-red-900 hover:tw-text-gray-100'
                                : ' tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800'}
                            `}
                radius='lg'>
                {text}
                {lock && <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/>}
            </Button>
        </Link>
    )
}

const Logo = () => (
    <>
        <Box align='center' className="tw-relative -tw-top-16 tw-h-[70px]">
            <Link href='/home' className="tw-h-[70px]">
            <Image src={'/logo.png'} width={86} alt="Logo Pace'sport" 
                    className='tw-rounded-full shadow-sm tw-bg-white tw-p-2 tw-z-20'/>
            </Link>
            
            <ActionIcon component="a" href='/parametres?prev=/login/as' radius={'xl'} size={'lg'}
                className="tw-bg-white tw-text-gray-900 tw-absolute tw-right-4 tw-top-16">
                <FiSettings />
            </ActionIcon>
        </Box>
    </>
)

const logout = () => {
    deleteCookie('token')
    router.push('/home')
}

export default function Page({status, loggedUser}){
    const router = useRouter()
    const logout = () => {
        deleteCookie('token')
        router.push('/home')
    }
    const context = useContext(AppContext)
    if (!context.user) {
        context.setUser(loggedUser)
    }

    const usernameParticulier = loggedUser?.prenom ? loggedUser?.prenom : 'Particulier'
    const associationLink = status.association == true 
            ? '/profil/association'
            : '/inscription/association';
    const sponsorLink = status.enseigne == true 
            ? '/profil/sponsor'
            : '/inscription/sponsor';
    return (
        <>
            <Head><title>Pace&#8217;sport - connexion</title></Head>
            <header>
                <Space my={'xl'} pt={'xl'} h={'xl'}/>
            </header>
            <Box className="tw-rounded-3xl" pt={'xl'} m={'lg'} bg={'dark'} >
                <Logo />
                <Title order={6} align="center" weight={600} color="white">
                        Se connecter en tant que</Title>
                <Flex justify='center' direction='column' mb='md' gap="xl">
                    <LinkButton className={'tw-px-16 tw-mb-0'} text={usernameParticulier} href='/' />
                </Flex>
                <Flex justify='center' direction='column' mb='md' gap="xl">
                    <LinkButton className={'tw-px-16 tw-mb-0'} text={<><RiAdminLine className="tw-mr-1" />Panel admin</>} href='/admin' />
                </Flex>
                <Flex className="tw-overflow-hidden" justify='center' direction='column'>
                    <Box className="tw-bg-zinc-900 tw-px-16 tw-skew-y-3 tw-h-6 tw-relative tw-top-4"></Box>
                    <Box className="tw-bg-zinc-900 tw-px-16" py={'md'}>
                        <Flex justify='center' direction='column' my='xs' py={'sm'} gap="xs">
                            <Title order={6} align="center" weight={600} color="white">Compte pro</Title>
                            <LinkButton className={''} text='Sponsor/Partenaire' href={sponsorLink} lock={true}/>
                            <LinkButton className={' tw-mb-2'} text='Association' href={associationLink} lock={true} />
                        </Flex>
                    </Box>
                    <Box className="tw-bg-zinc-900 tw-px-16 tw-skew-y-3 tw-h-6 tw-relative -tw-top-4"></Box>
                    <Box className="tw-px-16">
                        <Button 
                            onClick={logout}
                            className={`tw-my-5
                                        tw-w-full tw-bg-red-800 tw-text-white hover:tw-bg-red-900 hover:tw-text-gray-100'}
                                        `}
                            radius='lg'>Déconnexion</Button>
                    </Box>
                </Flex>
            </Box>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    const res = await fetch(`${process.env.API_URL}/api/account/is-signup-complete`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
      )
    const data = await res.json()
  
    if(data.code == 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }

    const user = await fetch(`${process.env.API_URL}/api/user`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
        )
    const userData = await user.json()
    

    // // Pass data to the page via props
    return { 
        props: {
             status: data.data,
             loggedUser: JSON.parse(userData.data)
        } 
    }
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout isLogoVisible={false}>{page}</Layout>
    )
  }