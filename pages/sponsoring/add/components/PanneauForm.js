import { Button, CloseButton, FileButton, Flex, Group, Image, MantineProvider, NumberInput, Text, TextInput, Textarea } from "@mantine/core";
import { GoPlus } from 'react-icons/go'
import { BsCurrencyEuro } from 'react-icons/bs'
import { Input } from "postcss";
import { useState, useId } from "react";
import { v4 as uuidv4 } from 'uuid';

const ImageRow = ({ images }) => {
    return (
        <>
            {images.map((img) => (
                <div className="tw-relative" key={img.src}>
                    <Image 
                        radius={'md'}
                        src={img.src}
                        height={90}
                        width={90}
                        alt="Ajouter"
                        withPlaceholder 
                        />
                    <CloseButton className="tw-bg-red-300/70 tw-h-3 tw-w-3 tw-top-1 tw-right-1 tw-absolute" color="red" aria-label="Supprimer l'image" />
                </div>
            ))}
        </> 
    )
}

export default function PanneauForm() {
    const [images, setImages] = useState([]);
    
    const imageUploader = (file) => {
        setImages([...images, {src: URL.createObjectURL(file)}])
    }

    return (
        <>
            <MantineProvider
                inherit
                theme={{
                    components: {
                    InputWrapper: {
                        styles: (theme) => ({
                        label: {
                            color: 'rgba(255, 255, 255)',
                        },
                        }),
                    },
                    },
                }}
                >
                <form className="tw-bg-gray-900 tw-rounded-xl tw-p-3 tw-text-white tw-relative">
                    <Text mb={'md'}>Images</Text>
                    <Group mb={'lg'}>
                        <ImageRow images={images} />
                        <FileButton onChange={imageUploader} accept="image/png,image/jpeg">
                            {(props) => <Button {...props} variant="outline" color="white"><GoPlus /></Button>}
                        </FileButton>
                    </Group>
                    <TextInput mb={'lg'} label="Nom de l'offre" withAsterisk/>
                    <Textarea mb={'lg'} autosize label="Description" />
                    <NumberInput mb={'lg'} label="Durée de l'offre (mois)" min={0} withAsterisk />
                    <NumberInput mb={'xl'} min={0} rightSection={<BsCurrencyEuro />}
                        label="Prix" withAsterisk />
                    <button className="tw-bg-gray-900 tw-text-white 
                        hover:tw-bg-black
                        tw-left-0 tw-right-0 tw-px-10 tw-py-2 
                        tw-border-[1px] tw-border-white tw-rounded-2xl
                        tw-absolute -tw-bottom-4 tw-mx-auto
                        "
                        type="submit">Ajouter</button>
                </form>
            </MantineProvider>
        </>
    )
}