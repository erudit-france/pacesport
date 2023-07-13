import Navbar from '@/components/navbar/Navbar';
import AvatarHeroSection from '@/components/association/AvatarHeroSection';
import { Box, Tabs, Title } from '@mantine/core';
import NavigationTabs from '@/components/admin/NavigationTabs';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Layout({children}){
    const router = useRouter()
    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Administrateur</title>
                <meta name="description" content="PACE&lsquo;SPORT" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <AvatarHeroSection background={children ? children.props.backgroundImage : null}  avatar={children ? children.props.avatar : null} />
            <main className="tw-bg-gradient-to-b tw-from-lightgold-50 tw-to-red-800 tw-rounded-t-[2rem]"
                style={{ minHeight: 'calc(100vh - 128px)' }}>
                <section className=" tw-pt-8 tw-relative">
                    <Box className="tw-relative">
                        <Title my={'md'} order={4} align="center">Asso 1</Title>
                    </Box>
                    <section className="tw-bg-white tw-mt-2 tw-shadow-inner tw-py-2 tw-px-1 tw-min-h-[calc(100vh-218px)] tw-rounded-t-3xl">
                    <Tabs defaultValue="offres" color="yellow"
                        value={router.query.activeTab}
                        onTabChange={(value) => router.push(`/admin/${value}`)}
                      >
                        <NavigationTabs />
                        {children}
                    </Tabs>
                    </section>
                </section>
            </main>
        </>
    )
}