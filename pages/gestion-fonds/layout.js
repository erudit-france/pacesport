import Navbar from "@/components/navbar/Navbar";
import { Box, Text } from "@mantine/core";
import Head from "next/head";
import GreyHeader from "../partenariat/components/GreyHeader";

export default function Layout({children}){
    return (
        <>
            <Head><title>Pace&lsquo;sport - Patenariats</title></Head>
            <Navbar />
            <GreyHeader text="Gestion de fonds" />
            <main className="tw-pt-7 tw-shadow-sm 
                tw-bg-gradient-to-b tw-from-red-500 tw-to-red-700 tw-rounded-t-[2rem] -tw-mt-8 tw-relative"
                style={{ minHeight: 'calc(100vh - 96px)' }}>{children}</main>
        </>
    )
}