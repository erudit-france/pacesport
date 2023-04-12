import { Carousel } from "@mantine/carousel";
import { Button, Flex, Image, Modal, NumberInput, Text, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";
import { GoPlus } from 'react-icons/go'
import { BsCurrencyEuro } from 'react-icons/bs'

export default function MaillotForm() {
    const [opened, setOpened] = useState(false);
    const maillotImages = [
        {text: 'Gauche', src: null},
        {text: 'Droite', src: null},
        {text: 'Avant', src: null},
        {text: 'Arrière', src: null}
    ]

    return (
        <>
            <Flex>
                <Button variant="outline" radius={'lg'} rightIcon={<GoPlus />}
                    className="tw-border-gray-800 tw-text-gray-800 tw-mx-auto" 
                    onClick={() => setOpened(true)}>
                    Ajouter un emplacement</Button>
            </Flex>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Ajouter emplacement maillot"
            >
                <Carousel my={'lg'} height={200} slideGap="sm" controlsOffset="md" withIndicators>
                    {maillotImages.map((img) => (
                        <Carousel.Slide key={img.text}>
                            <Flex className="tw-flex-col tw-mx-auto">
                                <Text fz={'sm'} dimmed={true} align="center">{img.text}</Text>
                                <Image  
                                    className="tw-mx-auto"       
                                    height={200}
                                    src={img.src}
                                    alt="With default placeholder"
                                    withPlaceholder/>
                            </Flex>
                        </Carousel.Slide>
                    ))}
                </Carousel>

                <TextInput mb={'lg'} label="Nom de l'offre" withAsterisk/>
                <Textarea mb={'lg'} autosize label="Description" />
                <NumberInput mb={'xl'} min={0} rightSection={<BsCurrencyEuro />} />

                <Flex>
                    <Button className="tw-mx-auto tw-bg-lime-600 hover:tw-bg-lime-700" radius={'lg'}>Ajouter</Button>
                </Flex>

            </Modal>
        </>
    )
}