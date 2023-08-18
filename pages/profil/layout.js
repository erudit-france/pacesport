import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/navbar/Navbar";
import LoggedInUserHero from "./components/LoggedInUserHero";

export default function Layout({children}){
    return (
        <>
             <Navbar />
            {/* <LoggedInUserHero/> */} 
            <HeroSection />
            <main className="tw-bg-gradient-to-b tw-from-[#d61515] tw-to-[#d61515] tw-rounded-t-[2rem]"
                style={{ minHeight: 'calc(100vh - 144px)' }}>{children}</main>
        </>
    )
}