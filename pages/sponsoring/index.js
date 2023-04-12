import Head from "next/head"
import Layout from "./layout"
import Link from "next/link"
import { GoPlus } from 'react-icons/go'
import { IoStatsChartSharp } from 'react-icons/io5'
import { Button, Flex, Image, Modal, Text, Title } from "@mantine/core"
import { useState } from "react"

export default function Page() {
    const [opened, setOpened] = useState(false);

    return (
        <>
            <Head><title>Sponsoring</title></Head>
            <header className="tw-flex tw-justify-around">
                <Button variant="outline" radius={'lg'} className="tw-border-gray-800 tw-text-gray-800" rightIcon={<GoPlus />}>
                    <Link href='' className="">Créer une offre </Link>
                </Button>
                <Button variant="filled" radius={'lg'} className="tw-bg-yellow-600/70 hover:tw-bg-yellow-600/80 tw-text-white">
                    <Link href='' className="">Suivi</Link>
                </Button>
                <Button variant="outline" radius={'lg'} className="tw-border-gray-800 tw-text-gray-800">
                    <Link href='' className=""><IoStatsChartSharp /></Link>
                </Button>
            </header>

            <Title order={1} className="tw-bg-yellow-600/70 tw-text-white tw-py-1 tw-shadow-sm tw-my-2" size='h6' align="center">Propositions d&lsquo;offres</Title>

            <Title order={1} className="tw-bg-yellow-600/70 tw-text-white tw-py-1 tw-shadow-sm tw-my-2" size='h6' align="center">Mes offres</Title>
            <Flex  className="tw-shadow-md tw-bg-gray-50" justify={'space-between'} px={'md'}>
                <Image
                    width={160}
                    height={100}
                    src={null}
                    alt="With default placeholder"
                    withPlaceholder
                    />
                <Flex className="tw-flex-col" justify={'center'} align={'center'}>
                    <Text align="center">Panneau</Text>
                    <Text align="center" className="tw-font-light tw-text-red-700 tw-text-sm">Attente de paiement</Text>
                </Flex>
                <Flex justify={'center'} align={'center'}>
                    <Button onClick={() => setOpened(true)}
                        variant="outline" radius={'lg'} 
                        className="tw-border-2 tw-border-yellow-600/70 tw-text-yellow-600/70
                          hover:tw-bg-yellow-600/80 hover:tw-text-white">
                        Détail</Button>
                </Flex>
            </Flex>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
            >
                <div className="container mx-auto">
                    <Flex>
                        <Image
                            className="tw-mx-auto"
                            width={160}
                            height={100}
                            src={null}
                            alt="With default placeholder"
                            withPlaceholder
                            />
                    </Flex>

                </div>
            </Modal>

        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}