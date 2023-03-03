import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/navbar/Navbar";

export default function Layout({children}){
    return (
        <>
          <Navbar />
          <HeroSection />
          <main>
            {children}
          </main>
        </>
    )
}