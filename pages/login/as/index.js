import { ActionIcon, Box, Button, Flex, Image, Space, Text, Title, Center } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { BsLock } from 'react-icons/bs'
import Layout from "@/components/layout/GradientDoodle"
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { FiSettings } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { getActiveSubscription } from '@/domain/repository/OrderRepository'

const LinkButton = ({ text, href, lock, className, onClick }) => {
    const router = useRouter()
    const logout = () => {
        deleteCookie('token_v2')
        router.push('/login')
    }

    return (
        <Link href={href}
            className={`tw-w-full ${className}`}
            onClick={text == 'Déconnexion'
                ? logout
                : () => setCookie('role', text?.toString().toLowerCase())}
        >
            <Button
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
    )
}

const Logo = () => (
    <>
        <Box align='center' className="tw-relative -tw-top-16 tw-h-[60px]">
            <Link href='/login' className="tw-h-[70px]">
                <Image src={'/logo.png'} width={86} alt="Logo Pace'sport"
                    className='tw-rounded-full shadow-sm tw-bg-white tw-p-2 tw-z-20' />
            </Link>

            <ActionIcon component="a" href='/parametres?prev=/login/as' radius={'xl'} size={'lg'}
                className="tw-bg-white tw-text-gray-900 tw-absolute tw-right-4 tw-top-16">
                <FiSettings />
            </ActionIcon>
        </Box>
    </>
)

const logout = () => {
    deleteCookie('token_v2')
    router.push('/login')
    localStorage.removeItem('token_v2');
}

export default function Page(props) {
    const [pacesportSubscription, setPacesportSubscription] = useState(props.pacesportSubscription)
    const context = useContext(AppContext)
    const router = useRouter()
    const logout = () => {
        deleteCookie('token_v2')
        router.push('/login')
        localStorage.removeItem('token_v2');
    }

    let loggedUser = props.loggedUser
    let status = props.status

    if (!context.user) {
        context.setUser(loggedUser)
    }
    const [visible, setVisible] = useState(true);  // Commence avec 'true'
    const overlayHandler = (isVisible) => setVisible(isVisible)
    // Cache l'overlay après que tout est chargé
    useEffect(() => {
        setVisible(true);  // Active l'overlay quand le composant est monté
        const timer = setTimeout(() => {
            setVisible(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);
    const overlayClass = visible ? 'fade-enter-active' : 'fade-exit-active';
    const user = loggedUser.user
    const isAdmin = loggedUser?.roles.includes('ROLE_ADMIN') ? true : false
    const usernameParticulier = loggedUser?.prenom ? loggedUser?.prenom + " " + loggedUser?.nom : 'Particulier'
    const associationLink = status.association == true
        ? '/profil/association'
        : '/inscription/association';
    const sponsorLink = status.enseigne == true
        ? '/profil/sponsor'
        : '/inscription/sponsor';
    return (
        <>
            <Head><title>Pace'sport - connexion</title></Head>
            <header>
                <Space my={'xl'} pt={'xl'} h={'xl'} />
            </header>
            <Box className={"tw-rounded-3xl " + overlayClass} pt={'lg'} mx={'md'} bg={'dark'}>
                <Logo />
                <Title order={6} align="center" mb={"md"} color="white" style={{ fontSize: '22px' }}>
                    {'Bonjour ' + loggedUser?.prenom}</Title>

                <Center>
                    <Box className="tw-rounded-x3 tw-shadow-lg tw-relative">
                        <a href={pacesportSubscription?.association?.id ? '/profil/particulier/carte' : '/'} >
                            <Image
                                className="tw-rounded-x3 tw-top-[140px] box222 glowing tw-w-full animate-pulse"
                                width={250}
                                height={163}
                                src={"/Design_carte_connexion-removebg-preview.png"}
                                alt="logo sim"
                            /></a><br />
                        <Flex className="tw-overflow-hidden" direction='column'>
                            {isAdmin &&
                                <Flex justify='center' direction='column' mb='md' gap="xl">
                                    <LinkButton className={'tw-px-16 tw-mb-0'} text={<><RiAdminLine className="tw-mr-1" />Panel admin</>} href='/admin' />
                                </Flex>}
                            <Flex direction='column' my='xs' py={'sm'} gap="xs" className="tw-rounded-xl tw-top-[340px]">
                                <Title order={6} align="center" style={{ fontSize: '18px' }} color="white">Compte pro</Title>
                                <LinkButton className={''} text='Sponsor/Partenaire' href={sponsorLink} lock={!status.enseigne} />
                                <LinkButton className={' tw-mb-2'} text='Association' href={associationLink} lock={!status.association} />
                            </Flex>
                        </Flex>

                        <Button
                            onClick={logout}
                            className={`tw-mb-5 
                                        tw-w-full tw-bg-[#d61515] tw-text-white hover:tw-bg-[#d61515] hover:tw-text-gray-100'}
                                        `}
                            radius='lg'>Déconnexion</Button>
                    </Box>
                </Center>
            </Box >
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

    if (data.code == 401) {
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
        })
    }
    )
    const userData = await user.json()

    let pacesportSubscription = await getActiveSubscription(token)
    pacesportSubscription = JSON.parse(pacesportSubscription.data)
    // // Pass data to the page via props
    return {
        props: {
            status: data.data,
            loggedUser: JSON.parse(userData.data),
            pacesportSubscription: pacesportSubscription
        }
    }
}

Page.getLayout = function getLayout(page) {
    return (
        <Layout isLogoVisible={false}>{page}</Layout>
    )
}