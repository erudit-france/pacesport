import Head from "next/head"
import Layout from "./layout"
import Link from "next/link"
import { GoPlus } from 'react-icons/go'
import { IoStatsChartSharp } from 'react-icons/io5'
import { Button, Flex, Image, Modal, Text, TextInput, Textarea, Title } from "@mantine/core"
import { useState } from "react"

export default function Page() {
    const [opened, setOpened] = useState(false);

    return (
        <>
            <Head><title>Sponsoring</title></Head>
            <header className="tw-flex tw-justify-around">
                <Link href='/sponsoring/add'>
                    <Button variant="outline" radius={'lg'} className="tw-border-gray-800 tw-text-gray-800" rightIcon={<GoPlus />}>
                        Créer une offre</Button></Link>
                <Link href=''>
                    <Button variant="filled" radius={'lg'} className="tw-bg-yellow-600/70 hover:tw-bg-yellow-600/80 tw-text-white">
                    Suivi</Button></Link>
                <Link href=''>
                    <Button variant="outline" radius={'lg'} className="tw-border-gray-800 tw-text-gray-800">
                        <IoStatsChartSharp /></Button></Link>
            </header>

            <Title order={1} className="tw-bg-yellow-600/70 tw-text-white tw-py-1 tw-shadow-sm tw-mt-8" size='h6' align="center">Propositions d&lsquo;offres</Title>

            <Title order={1} className="tw-bg-yellow-600/70 tw-text-white tw-py-1 tw-shadow-sm tw-mt-6" size='h6' align="center">Mes offres</Title>
            <Flex  className="tw-shadow-md tw-bg-gray-50" justify={'space-between'} px={'md'}>
                <Image
                    width={140}
                    height={90}
                    src={null}
                    alt="With default placeholder"
                    withPlaceholder
                    />
                <Flex className="tw-flex-col" justify={'center'} align={'center'}>
                    <Text align="center" fz={'sm'}>Panneau</Text>
                    <Text align="center" fz={'xs'} className="tw-font-light tw-text-red-700">Attente de paiement</Text>
                </Flex>
                <Flex justify={'center'} align={'center'}>
                    <Button onClick={() => setOpened(true)}
                        variant="outline" radius={'lg'} 
                        className="tw-border-yellow-600/70 tw-text-yellow-600/70
                          hover:tw-bg-yellow-600/80 hover:tw-text-white
                            tw-border-[1.8px] tw-text-sm tw-py-1 tw-px-2">
                        Détails</Button>
                </Flex>
            </Flex>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
            >
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
                    <Flex my={'lg'} direction={'column'}>
                        <Flex my={'lg'}>
                            <TextInput
                                className="tw-font-semibold"
                                variant="filled"
                                readOnly
                                description="Prix"
                                value="1000 €"
                                />
                            <TextInput
                                className="tw-font-semibold"
                                variant="filled"
                                readOnly
                                description="Jusqu'au"
                                value="05/03/2023"
                                />
                        </Flex>
                        <Textarea
                            variant="filled"
                            label="Description"
                            value="Description de l'offre, valable jusqu'au 5 mars 2023, panneau de dimensions 140x300"
                            autosize
                            />
                    </Flex>
            </Modal>

        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout text="Partenariat" subtext={"Sponsoring"}>{page}</Layout>
    )
}