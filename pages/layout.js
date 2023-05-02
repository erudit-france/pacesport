import { BackgroundImage } from "@mantine/core";
import Navbar from '@/components/navbar/Navbar';
import HeroSection from '@/components/particulier/HeroSection';
    
export default function Layout({children}){
    return (
        <>
            <Navbar />
            <main className="tw-w-screen tw-relative">
                <div className="tw-w-full tw-h-full">
                    <HeroSection avatar={children ? children.props.avatar : null} />
                    <section className="tw-z-20">{children}</section>
                </div>
                <div className="tw-w-full tw-h-full tw-absolute tw-top-0 -tw-z-10">
                    <BackgroundImage className="tw-h-full tw-opacity-10 tw-invert " 
                        src={'/doodle-pattern.png'}/>
                    <BackgroundImage className="tw-h-full tw-w-full tw-absolute tw-top-0 tw-opacity-80 -tw-z-20
                        tw-bg-gradient-to-b tw-from-white tw-from-10% tw-via-red-600 tw-via-40% tw-to-red-800 tw-to-90%" />
                </div>
            </main>
        </>
    )
}