import Navbar from "@/components/navbar/Navbar";
import LoggedInAssociationHero from "../profil/(association)/components/LoggedInAssociationHero";

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <LoggedInAssociationHero />
            <main className="tw-bg-gradient-to-b tw-from-red-500 tw-to-red-700 tw-rounded-t-[2rem]"
                style={{ minHeight: 'calc(100vh - 144px)' }}>{children}</main>
        </>
    )
}