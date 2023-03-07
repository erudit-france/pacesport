import { Button, Divider, Flex, Text } from "@mantine/core";
import Head from "next/head";
import SearchSponsor from "./components/SearchSponsor";
import UserListButton from "./components/UserListButton";
import Layout from "./layout";
import SponsorInvitation from "./components/SponsorInvitation";
import { GoPlus } from 'react-icons/go'
import CampagneList from "./components/CampagneList";
import Link from "next/link";

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
                    <Link href="/profil/(association)/campagne/ajouter">
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
                
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }