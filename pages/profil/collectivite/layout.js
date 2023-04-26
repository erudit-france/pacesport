import Navbar from '@/components/navbar/Navbar';
import HeroSection from "@/components/sponsor/HeroSection";

export default function Layout({children}){
    return (
        <>
          <main className='tw-overflow-hidden' >
            <Navbar />
            <HeroSection avatar={children ? children.props.avatar : null} />
            <section className="tw-bg-gradient-to-b tw-from-gray-100 tw-to-gray-300  tw-mt-6"
                  style={{ minHeight: 'calc(100vh - 150px)' }}>{children}</section>
          </main>
        </>
    )
}