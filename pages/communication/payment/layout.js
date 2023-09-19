import Navbar from "@/components/navbar/Navbar";
import { Box, Text } from "@mantine/core";
import Head from "next/head";
import GreyHeader from "../components/GreyHeader";

export default function Layout({children}){
    return (
        <>
            <Head><title>Pace'sport - Patenariats</title></Head>
            <Navbar />
            <GreyHeader text="" />
            <main className="tw-pt-7 tw-shadow-sm 
                tw-border-2 tw-border-gray-300 shadow-sm
                tw-bg-white tw-rounded-t-[2rem] -tw-mt-8 tw-relative"
                style={{ minHeight: 'calc(100vh - 96px)' }}>{children}</main>
        </>
    )
}