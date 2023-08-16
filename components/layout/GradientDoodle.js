import Image from "next/image";
import logo from '@/public/logo.png'
import { BackgroundImage, Space } from "@mantine/core";
import Link from "next/link";


const HeroSection = ({isLogoVisible = true}) => {
    return (
        <>
            {isLogoVisible != false && 
            <header className='tw-flex tw-justify-center tw-h-36 tw-relative'>
                <div className='tw-flex tw-flex-col tw-justify-center'>
                    <Link href='/login'>
                    <Image src={logo} height={70} width={70} alt="Logo Pace'sport" 
                            className='tw-rounded-full shadow-sm tw-bg-white tw-p-2 tw-z-20'/>
                    </Link>
                </div>
            </header>
            }
        </>
    )
}

export default function Layout({isLogoVisible, children}){
    return (
        <main className="tw-h-screen tw-w-screen tw-relative">
            <div className="tw-w-full tw-h-full">
                <HeroSection isLogoVisible={isLogoVisible} />
                <section className="tw-z-20">{children}</section>
            </div>
            <div className="tw-w-full tw-h-full tw-absolute tw-top-0 -tw-z-10">
                <BackgroundImage className="tw-h-full tw-opacity-10 " 
                    src={'/doodle-pattern.png'}/>
                <BackgroundImage className="tw-h-full tw-w-full tw-absolute tw-top-0 tw-opacity-80 -tw-z-20
                    tw-bg-gradient-to-b tw-from-white tw-from-10% tw-via-red-600 tw-via-40% tw-to-red-800 tw-to-90%" />
            </div>
        </main>
    )
}