import { Carousel } from "@mantine/carousel";
import { Button, Flex, Group, Image, Modal, NumberInput, Paper, Text, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";
import { GoPlus } from 'react-icons/go'
import { BsCurrencyEuro } from 'react-icons/bs'
import MaillotModal from "./MaillotModal";

export default function MaillotForm() {
    const [opened, setOpened] = useState(false);
    const [maillotOffers, setMaillotOffers] = useState([]);

    const offers = maillotOffers.map((offer, idx) => (
        <Paper key={idx} radius={'lg'} shadow="md" p={'lg'} mb={'md'}>
            <Text align="center" color="dimmed" fz={'sm'}>{offer.img.text}</Text>
            <Image src={offer.img.src} height={100} alt={offer.img.text} withPlaceholder/>
            <Flex my={'lg'} direction={'column'}>
                <Group my={'lg'} grow>
                    <TextInput
                        className="tw-font-semibold"
                        variant="filled"
                        readOnly
                        description="Nom"
                        value={offer.nom}
                        />
                    <TextInput
                        className="tw-font-semibold"
                        variant="filled"
                        readOnly
                        description="Description"
                        value={offer.description}
                        />
                </Group>
                <TextInput
                    className="tw-font-semibold"
                    variant="filled"
                    readOnly
                    description="Prix"
                    value={offer.prix}
                    rightSection={<BsCurrencyEuro />}
                    />
            </Flex>
        </Paper>
    ))

    return (
        <>
            {offers}
            <Flex mt={'md'}>
                <Button variant="outline" radius={'lg'} rightIcon={<GoPlus />}
                    className="tw-border-gray-800 tw-text-gray-800 tw-mx-auto" 
                    onClick={() => setOpened(true)}>
                    Ajouter un emplacement</Button>
            </Flex>
            <MaillotModal 
                opened={opened} setOpened={setOpened} 
                maillotOffers={maillotOffers} setMaillotOffers={setMaillotOffers}/>
        </>
    )
}