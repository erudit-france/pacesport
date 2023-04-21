import { Button, Divider, Flex, Space, Text } from "@mantine/core";
import Head from "next/head";
import SearchSponsor from "./components/SearchSponsor";
import UserListButton from "./components/UserListButton";
import Layout from "./layout";
import SponsorInvitation from "./components/SponsorInvitation";
import { GoPlus } from 'react-icons/go'
import CampagneList from "./components/CampagneList";
import Link from "next/link";
import { BsLock } from "react-icons/bs";
import { GrMoney } from "react-icons/gr";
import { BiMessage } from "react-icons/bi";
import { getCookie } from "cookies-next";

export default function Page(){
    const isAccountLimited = true

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Mon compte</title>
                <meta name="description" content="PACE&lsquo;SPORT" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className="tw-px-4">
                {isAccountLimited && 
                    <Text fz={"sm"} className="tw-font-semibold" align="center" p='lg'>Votre accès est limité le temps que votre association soit validée</Text>}
                <SearchSponsor />
                <Flex mt={'md'} justify={'space-between'}>
                    <UserListButton />
                    <Divider className="tw-border-gray-200 tw-mx-3 md:tw-mx-8" size="sm" orientation="vertical" />
                    <SponsorInvitation />
                </Flex>
            </section>

            <section className="tw-bg-white tw-mt-6 tw-shadow-inner tw-py-5 tw-px-4">
                <Flex justify={'space-between'} pb={'sm'}>
                    <Text fz={'sm'} fw={'bold'} align={'center'} transform={'uppercase'} py={2}>Mon Pace&lsquo;sport</Text>
                    <Link href="/profil/association/campagne/ajouter">
                        <Button size="xs" rightIcon={<GoPlus size="1rem" />}
                            className="tw-bg-gray-900 tw-text-gray-100 tw-text-xs tw-rounded-xl
                                        hover:tw-bg-black" 
                            >
                            Nouvelle campagne
                        </Button>
                    </Link>
                </Flex>
                <CampagneList />
            </section>

            <Space className="tw-mt-1"></Space>

            <section className="tw-bg-yellow-300/70 tw-flex tw-flex-col tw-py-4">
                <Text color="white" align="center">Offre de sponsoring</Text>
                <Text className="tw-flex tw-justify-center" align="center">Uniquement avec Pace&lsquo;sport Business<BsLock className='tw-my-auto tw-ml-1'/></Text>
                <Button color="white" variant="filled" size="xs" 
                    className="tw-bg-white tw-text-black hover:tw-bg-gray-200 tw-mx-auto tw-mt-3" radius={'lg'}>En savoir plus</Button>
            </section>

            
            <section className="tw-flex tw-flex-col tw-py-4">
                <Link href='/messages' className="tw-mx-auto tw-mt-3">
                    <Button color="white" variant="filled" size="sm" leftIcon={<BiMessage />} miw={200}
                        className="tw-bg-white tw-text-black hover:tw-bg-gray-200" radius={'lg'}>
                            Messagerie</Button></Link>
                <Link href='/gestion-fonds' className="tw-mx-auto tw-mt-3">
                        <Button color="white" variant="filled" size="sm" leftIcon={<GrMoney />} miw={200}
                        className="tw-bg-white tw-text-black hover:tw-bg-gray-200" radius={'lg'}>
                            Gestion de fonds</Button></Link>
            </section>
                
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let avatar = await fetch(`${process.env.API_URL}/api/association/avatar`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
    )
    avatar = await avatar.json();
    console.log('avatar', avatar)
    if (avatar.code == 401) {
        return {
            redirect: {
            permanent: false,
            destination: "/login"
            }
        }
    }
  
    // // Pass data to the page via props
    return { props: {
      avatar: avatar.filename
    } }
  }
  

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }