import Navbar from '@/components/navbar/Navbar';
import AvatarHeroSection from '@/components/association/AvatarHeroSection';

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <AvatarHeroSection background={children ? children.props.backgroundImage : null}  avatar={children ? children.props.avatar : null} />
            <main className="tw-bg-gradient-to-b tw-from-lightgold-50 tw-to-red-800 tw-rounded-t-[2rem]"
                style={{ minHeight: 'calc(100vh - 144px)' }}>{children}</main>
        </>
    )
}