import Navbar from "@/components/navbar/Navbar";
import CampagneHeaderEditable from "../components/CampagneHeaderEditable";

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <CampagneHeaderEditable />
            <main className="tw-bg-gradient-to-b tw-from-gray-100 tw-to-white tw-rounded-t-[2rem] tw-relative -tw-mt-7"
                style={{ minHeight: 'calc(100vh - 180px)' }}>{children}</main>
        </>
    )
}