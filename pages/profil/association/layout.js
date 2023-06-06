import Navbar from '@/components/navbar/Navbar';
import HeroSection from "@/components/association/HeroSection";

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <HeroSection background={children ? children.props.backgroundImage : null}  avatar={children ? children.props.avatar : null} />
            <main className="tw-bg-gradient-to-b tw-from-red-500 tw-to-red-700 tw-rounded-t-[2rem]"
                style={{ minHeight: 'calc(100vh - 144px)' }}>{children}</main>
        </>
    )
}