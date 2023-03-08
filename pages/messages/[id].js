import { Avatar, Button, Flex, ScrollArea, Text, TextInput } from "@mantine/core"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "./layout"
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'

export default function ChatPage({id}) {
    const user = {
        name: 'Grand frais',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
        message: 'Merci pour votre retour',
        time: '01/03',
        unreadNumber: 0,
    }
    const router = useRouter()
    const contactId = router.query.id

    return (
        <>
            <Head>
                <title>Pace&lsquo;Sport - USERNAME</title>
            </Head>
            <section className="tw-mx-2 tw-pt-2 tw-bg-white tw-rounded-t-3xl tw-top-2 tw-relative"
                    style={{ height: 'calc(100vh - 170px)' }}>
                    <header className="tw-shadow-sm tw-py-1">
                        <Flex mx={'md'} justify={"space-between"} className="tw-relative">
                            <Link className="tw-rounded-md tw-px-3
                                    tw-border-[1px] tw-border-gray-700 tw-text-gray-900
                                    hover:tw-text-gray-50 hover:tw-bg-gray-900 hover:tw-border-white
                                    hover:" 
                                    href={'/messages'}>
                                <HiOutlineArrowNarrowLeft size={'1.6rem'}/></Link>
                                <Text className="tw-text-center tw-font-semibold tw-absolute
                                        tw-left-1/2 -tw-translate-x-1/2 tw-top-0.5" 
                                        >{user.name}</Text>
                            <Avatar className="tw-shadow-md tw-bg-contain" radius={'xl'} size={'sm'} src={user.logo} />
                        </Flex>
                    </header>
                    <ScrollArea className="tw-p-2" 
                                style={{ height: 'calc(100vh - 286px)' }}
                                offsetScrollbars>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                                    <p>HELEHLHE</p>
                    </ScrollArea>
                    <Flex>
                        <Flex>
                        <TextInput radius='lg' placeholder="message"></TextInput>
                        </Flex>
                    </Flex>
            </section>
        </>
    )
}

ChatPage.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}