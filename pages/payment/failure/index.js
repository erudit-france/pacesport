import { Box, Button, Center, Flex, Group, Modal, Stack, Text, Textarea, Title } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";
import Layout from "../layout"
import { getUser } from "@/domain/repository/UserRepository";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function Page(props) {

    return (
        <>
            <div className="tw-container tw-mx-auto tw-px-2">
                <Box my={'sm'}>
                </Box>
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
    const token = context.req.cookies['token_v3']

    let url = context.req.headers.referer
    let previousUrl = url === undefined ? '/profil/sponsor/' : url


    // // Pass data to the page via props
    return {
        props: {
            cancelUrl: `${process.env.NEXT_URL}${context.resolvedUrl}`,
            baseUrl: `${process.env.NEXT_URL}`
        }
    }
}


Page.getLayout = function getLayout(page) {
    return (
        <Layout>{page}</Layout>
    )
}