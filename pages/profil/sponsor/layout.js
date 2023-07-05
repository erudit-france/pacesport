import Navbar from '@/components/navbar/Navbar';
import HeroSection from "@/components/sponsor/HeroSection";

export default function Layout({children}){
    return (
        <>
          <main className='tw-overflow-hidden' >
            <Navbar />
            <HeroSection background={children ? children.props.backgroundImage : null}  avatar={children ? children.props.avatar : null} />
            <section className="tw-bg-gradient-to-b tw-from-gray-50 tw-to-white tw-rounded-t-3xl tw-pt-1 tw-mt-6"
                  style={{ minHeight: 'calc(100vh - 150px)' }}>{children}</section>
          </main>
        </>
    )
}