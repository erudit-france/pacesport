import { Button, Flex } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { BsLock } from 'react-icons/bs'
import Layout from "./layout";
import { useContext } from "react";
import AppContext from "@/context/AppContext";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

const LinkButton = ({text, href, lock, onClick}) => {
    const router = useRouter()
    const logout = () => {
        console.log('hello')
        deleteCookie('token')
        router.push('/')
    }
    const context = useContext(AppContext)
    return (
        <Link href={href} className="tw-w-full"
            onClick={text == 'Déconnexion' 
                        ? () => logout
                        : () => context.setRole(text.toLowerCase())}
            >
            <Button 
                className={`tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800
                            tw-w-full`}
                radius='lg'>
                {text}
                {lock && <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/>}
            </Button>
        </Link>
    )
}

export default function Page({status}){
    const context = useContext(AppContext)
    const associationLink = status.association == true 
            ? '/profil/association'
            : '/inscription/association';
    const sponsorLink = status.enseigne == true 
            ? '/partenariat'
            : '/inscription/sponsor';
    return (
        <>
            <Head>
                <title>Pace&#8217;sport - connexion</title>
            </Head>
            <h3 className="tw-pt-2 tw-text-center py-4 tw-font-semibold tw-text-white">Se connecter en tant que</h3>
            <Flex justify='center' direction='column' mt='xl' gap="md" px='sm'>
                <LinkButton text='Particulier' href='/' />
                <LinkButton text='Sponsor' href={sponsorLink} lock={true} />
                <LinkButton text='Association' href={associationLink} lock={true} />
                <LinkButton text='Déconnexion' href={''} />
            </Flex>
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
  
    if(data.code == 401) 
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }

    // // Pass data to the page via props
    return { props: { status: data.data } }
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }