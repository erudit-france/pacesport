import Navbar from '@/components/navbar/Navbar';
import HeroSection from "@/components/association/HeroSection";

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <HeroSection avatar={children ? children.props.avatar : null} />
            <main className="tw-bg-gradient-to-b tw-from-lightgold-50 tw-to-lightgold-100 tw-rounded-t-[2rem]"
                style={{ minHeight: 'calc(100vh - 144px)' }}>{children}</main>
        </>
    )
}