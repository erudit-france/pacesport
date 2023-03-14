import { Button, Flex, Text } from "@mantine/core"
import Head from "next/head"
import Link from "next/link"
import OfferList from "./components/OfferList"
import Layout from "./layout"

export default function Page() {
    return (
        <>  
            <div className="tw-mx-1">
                <Flex className="tw-bg-gray-300 tw-shadow-inner tw-py-3 tw-rounded-t-md border-3" px={'md'} justify={"space-between"}>
                    <Text className="tw-text-gray-700 tw-uppercase tw-font-bold tw-text-[.9rem] tw-tracking-wide">Mes offres</Text>
                    <Link href={''}>
                        <Button variant="filled" color={'dark'} size={'md'} className="tw-bg-black tw-h-6 -tw-top-0.5 tw-font-semibold">Ajouter</Button>
                    </Link>
                </Flex>
                <OfferList />
            </div>

        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}