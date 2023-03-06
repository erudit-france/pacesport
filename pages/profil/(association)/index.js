import { Divider, Flex, Text } from "@mantine/core";
import Head from "next/head";
import SearchSponsor from "./components/SearchSponsor";
import UserListButton from "./components/UserListButton";
import Layout from "./layout";
import SponsorInvitation from "./components/SponsorInvitation";

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
                    <Text fz='md' fw='bold' align="center" py='md'>Votre accès est limité le temps que votre association soit validée</Text>}
                <SearchSponsor />
                <Flex mt={'md'} justify={'space-between'}>
                    <UserListButton />
                    <Divider className="tw-border-gray-200 tw-mx-3 md:tw-mx-8" size="sm" orientation="vertical" />
                    <SponsorInvitation />

                </Flex>
            </section>
                
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }