import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/navbar/Navbar";

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <HeroSection />
            <main className="tw-bg-gradient-to-b tw-from-[#c32428] tw-to-[#ad0a0c] tw-rounded-t-[2rem]"
                style={{ minHeight: 'calc(100vh - 144px)' }}>{children}</main>
        </>
    )
}