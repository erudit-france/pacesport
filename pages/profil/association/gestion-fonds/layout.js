import Navbar from "@/components/navbar/Navbar";
import { Box, Flex, Image, Text } from "@mantine/core";
import Head from "next/head";
import hero from '@/public/stadium_chairs.jpg'


export default function Layout({children, text, subtext}){
    return (
        <>
            <Head><title>Pace&lsquo;Sport - Gestion des fonds</title></Head>
            <Navbar />
            <header className='tw-flex tw-justify-center tw-h-36 tw-relative'>
                <div className='tw-flex tw-flex-col tw-justify-center'>
                    <Flex className="tw-flex tw-flex-col">
                        <Text className="tw-text-gray-50 tw-mb-0"  fz='xl' weight={'bold'} align="center">{text}</Text>
                        <Text className="tw-text-gray-50"  fz='sm' weight={'lighter'} transform="uppercase" align="center">{subtext}</Text>
                    </Flex>
                </div>
                <Image className='tw-w-full tw-h-full tw-absolute tw-object-cover -tw-z-10 tw-blur-sm tw-scale-110 tw-sepia tw-contrast-75' src={hero.src} placeholder='blur' alt="Hero image"/>
            </header>
            <main className="tw-shadow-sm 
                tw-border-2 tw-border-gray-300 shadow-sm
                tw-bg-gray-100 -tw-mt-4 tw-pt-2 tw-relative"
                style={{ minHeight: 'calc(100vh - 96px)' }}>
                <div className="tw-bg-gray-200 tw-rounded-md tw-mx-1 tw-py-2">
                    {children}
                </div>
            </main>
        </>
    )
}