import Head from "next/head";
import Layout from "../layout";
import PreviousPageButton from "@/components/PreviousPageButton";
import { Box, Button, Center, Container, Divider, Flex, Group, Table, Text, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { serialize } from "object-to-formdata";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";
import moment from "moment";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

export default function Page(props) {
    const router = useRouter()
    const prev = router.query?.prev || ''
    
    const paiement = {
        date: '2023-03-02',
        data: {name: 'Pierre B', ammount: 15.99, card: '43XX XXXX XXXX XXX3'}
    }

    const NavHeader = () => (
        <Flex justify='space-between' p={'md'}>
            <Link href={prev}><Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button></Link>
        </Flex>
    )

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Détails</title>
            </Head>
            <NavHeader />
            <main className="tw-bg-gradient-to-b tw-from-gray-100 tw-to-gray-50 tw-rounded-t-[2rem] tw-relative tw-shadow-inner"
                style={{ maxHeight: 'calc(100vh - 280px)' }}>
                <Table fontSize={'sm'} py={'lg'}>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>date</th>
                            <th>Montant</th>
                            <th>CB</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="tw-bg-gray-200">
                            <td>{paiement.data.name}</td>
                            <td className="tw-text-center tw-font-semibold tw-bg-gray-50">{paiement.date}</td>
                            <td>{paiement.data.ammount} €</td>
                            <td>{paiement.data.card}</td>
                        </tr>
                    </tbody>
                </Table>
            </main>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']

      // // Pass data to the page via props
    return { props: { 
    } }
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }