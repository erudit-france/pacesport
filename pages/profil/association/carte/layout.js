import Navbar from '@/components/navbar/Navbar';
import HeroSection from "@/components/association/HeroSection";
import AvatarHeroSection from '@/components/association/AvatarHeroSection';

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <AvatarHeroSection background={children ? children.props.backgroundImage : null}  avatar={children ? children.props.avatar : null} />
            <main className="tw-bg-gradient-to-b tw-from-red-800 tw-to-red-600 tw-rounded-t-[2rem]"
                style={{ minHeight: 'calc(100vh - 128px)' }}>{children}</main>
        </>
    )
}