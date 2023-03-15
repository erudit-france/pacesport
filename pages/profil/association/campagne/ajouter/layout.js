import Navbar from "@/components/navbar/Navbar";
import CampagneHeader from "../components/CampagneHeader";

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <CampagneHeader />
            <main className="tw-bg-gradient-to-b tw-from-gray-200 tw-to-gray-100 tw-rounded-t-[2rem] tw-relative -tw-mt-7"
                style={{ minHeight: 'calc(100vh - 180px)' }}>{children}</main>
        </>
    )
}