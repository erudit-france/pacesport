import Navbar from "@/components/navbar/Navbar";
import { Flex, Text } from "@mantine/core";
import hero from '@/public/stadium_chairs.jpg'
import Image from "next/image";


export default function Layout({children}){
    return (
        <>
            <Navbar />
            <header className='tw-flex tw-justify-center tw-h-36 tw-relative'>
                <div className='tw-flex tw-flex-col tw-justify-center'>
                    <Flex className="tw-flex tw-flex-col">
                        <Text className="tw-text-gray-50 tw-mb-0"  fz='xl' weight={'bold'} align="center">Partenariat</Text>
                        <Text className="tw-text-gray-50"  fz='sm' weight={'lighter'} transform="uppercase" align="center">Sponsoring</Text>
                    </Flex>
                </div>
                <Image className='tw-w-full tw-h-full tw-absolute tw-object-cover -tw-z-10 tw-blur-sm tw-scale-110 tw-sepia tw-contrast-75' src={hero} placeholder='blur' alt="Hero image"/>
            </header>
            <main className="tw-pt-7 tw-shadow-sm 
                tw-border-2 tw-border-gray-300 shadow-sm
                tw-bg-white tw-rounded-t-[2rem] -tw-mt-8 tw-relative"
                style={{ minHeight: 'calc(100vh - 96px)' }}>{children}</main>
        </>
    )
}