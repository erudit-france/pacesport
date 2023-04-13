import { Carousel, Embla } from "@mantine/carousel";
import { Button, Flex, Image, Modal, NumberInput, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { BsCurrencyEuro } from "react-icons/bs";

export default function MaillotModal({opened, setOpened, maillotOffers, setMaillotOffers, maillotImages}) {
    const [embla, setEmbla] = useState(null);
    
    const form = useForm({
        initialValues: {
            nom: '',
            description: '',
            prix: 0,
            maillotIndex: -1,
        },
        validate: {
          nom: (value) => (value != '' ? null : 'Veuillez saisir un nom'),
          description: (value) => (value != '' ? null : 'Veuillez saisir une description'),
          prix: (value) => (value > 0 ? null : 'Veuillez saisir un prix'),
        },
    });

    const submitHandler = (values) => {
        let maillotIndex = embla.selectedScrollSnap()
        setMaillotOffers([...maillotOffers, {...values, img: maillotImages[maillotIndex]}])
        form.reset();
        setOpened(false)
    }

    const slides = maillotImages.map((img) => (
        <Carousel.Slide key={img.text}>
            <Flex direction={'column'} sx={{width: '320px'}}>
                <Text color={"dimmed"} align="center">{img.text}</Text>
                <Image 
                    height={200}
                    className="tw-mx-auto"       
                    src={img.src}
                    alt="With default placeholder"
                    withPlaceholder/>
            </Flex>
        </Carousel.Slide>
    ));

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Ajouter emplacement maillot"
            >
                <Carousel my={'lg'} maw={320} mx={"auto"} height={200} withIndicators getEmblaApi={setEmbla}>
                    {slides}
                </Carousel>

                <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
                    <TextInput mb={'lg'} label="Nom de l'offre" withAsterisk
                        {...form.getInputProps('nom')}/>
                    <Textarea mb={'lg'} autosize label="Description" withAsterisk
                        {...form.getInputProps('description')}/>
                    <NumberInput mb={'xl'} min={0} rightSection={<BsCurrencyEuro />} withAsterisk
                        {...form.getInputProps('prix')}/>

                    <Flex>
                        <Button type="submit" className="tw-mx-auto tw-bg-lime-600 hover:tw-bg-lime-700" radius={'lg'}>
                            Ajouter</Button>
                    </Flex>
                </form>

            </Modal>
        </>
    )
}    