import { ScrollArea } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import Head from "next/head"
import { useState } from "react";
import ContactList from "./components/ContactList";
import SearchUser from "./components/SearchUser";
import Layout from "./layout"


export default function Page(){
    const [title, setTitle] = useState('Pace\'Sport - Messages');
    useDocumentTitle(title);

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <section className="tw-mx-3 tw-pt-4">
                <SearchUser />
                <ScrollArea className="tw-bg-white tw-p-2 tw-py-5 tw-rounded-3xl tw-mt-2" 
                    offsetScrollbars
                    style={{ height: 'calc(100vh - 220px)' }}>
                    <ContactList />
                </ScrollArea>
            </section>
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}