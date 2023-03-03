import Navbar from "@/components/navbar/Navbar";
import LoggedInUserHero from "./components/LoggedInUserHero";

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <LoggedInUserHero />
            <main>{children}</main>
        </>
    )
}