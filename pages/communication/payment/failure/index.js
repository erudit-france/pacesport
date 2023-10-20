import { Box, Button, Center, Flex, Group, Modal, Stack, Text, Textarea, Title } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";
import Layout from "../layout"
import { useForm } from "@mantine/form";
;
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";
import { useState } from "react";
import { serialize } from "object-to-formdata";
import { getUser } from "@/domain/repository/UserRepository";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function Page(props) {

    return (
        <>
            <div className="tw-container tw-mx-auto tw-px-2">
                <Stack>
                    <Center>
                        <FiXCircle className="tw-text-red-700" size={56} />
                    </Center>
                    <Title mt={'lg'} align="center" order={3} className="tw-text-gray-800">Erreur transaction</Title>
                    <Title mt={'lg'} align="center" order={6} className="tw-text-gray-500">Veuillez réssayer plus tard</Title>

                </Stack>
            </div>
        </>
    )
}


export async function getServerSideProps(context) {
    const token = context.req.cookies['token_v2']

    let url = context.req.headers.referer
    let previousUrl = url === undefined ? '/profil/sponsor/' : url

    let user = await getUser(token)
    if (user.code == 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }
    user = JSON.parse(user.data)

    // // Pass data to the page via props
    return {
        props: {
            cancelUrl: `${process.env.NEXT_URL}${context.resolvedUrl}`,
            baseUrl: `${process.env.NEXT_URL}`,
            user: user
        }
    }
}


Page.getLayout = function getLayout(page) {
    return (
        <Layout>{page}</Layout>
    )
}