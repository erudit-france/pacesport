import { Button, CloseButton, FileButton, Flex, Group, Image, MantineProvider, NumberInput, Text, TextInput, Textarea } from "@mantine/core";
import { GoPlus } from 'react-icons/go'
import { BsCurrencyEuro } from 'react-icons/bs'
import { Input } from "postcss";
import { useState, useId } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "@mantine/form";
import { serialize } from "object-to-formdata";
import fileUploader from "@/utils/fileUploader";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import multipleFilesUploader from "@/utils/multipleFilesUploader";
import { useRouter } from "next/navigation";

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
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const { push } = useRouter()
    const imageUploader = (file) => {
        setImages([...images, {src: URL.createObjectURL(file)}])
        setFiles([...files, file])
    }

    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            duration: '',
            price: ''
        },
        validate: {
            title: (v) => v != '' ? null : 'Veuillez saisir un titre',
            price: (v) => v > 0 ? null : 'Veuillez saisir un prix',
            duration: (v) => v > 0 ? null : 'Veuillez saisir une durée' 
        }
    })
    
    
    const submitHandler = async (values) => {
        setLoading(true)
        let filesUploadRes = await multipleFilesUploader(files);

        multipleFilesUploader(files)
            .then((res) => {
                if (res.data?.code == 0) {
                    Toast.error(res.data.message)
                    setLoading(false)
                    return;
                }
                let body = serialize(values);
                // if obligatoire dans le cas ou on upload des images
                if (res.data) { body.append('filenames', res.data.filenames) }
                fetch(`/api/sponsoring-offer`, {
                    method: 'POST',
                    type: 'cors',
                    headers: new Headers({
                    'JWTAuthorization': `Bearer ${getCookie('token')}`
                    }),
                    body: body
                })
                .then(res => res.json())
                    .then(res => {
                        if (res.data.code == 1) {
                            Toast.success(res.data.message)
                            setTimeout(() => {
                                push('/profil/association')
                            }, 2000)
                        } else {
                            Toast.error(res.data.message)
                            setLoading(false)
                        }
                    })
                    .catch((error) => { 
                        Toast.error('Erreur pendant la création de l\'offre') 
                        console.log('error', error)
                        setLoading(false)
                    })
                .catch((err) => {
                    Toast.error('Erreur pendant le téléchargement des images')
                    setLoading(false)
                })
            })
        return
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
                <form onSubmit={form.onSubmit((values) => submitHandler(values))} 
                    className="tw-bg-gray-900 tw-rounded-xl tw-p-3 tw-text-white tw-relative">
                    <Text mb={'md'}>Images</Text>
                    <Group mb={'lg'}>
                        <ImageRow images={images} />
                        <FileButton onChange={imageUploader} accept="image/png,image/jpeg">
                            {(props) => <Button {...props} variant="outline" color="white"><GoPlus /></Button>}
                        </FileButton>
                    </Group>
                    <TextInput mb={'lg'} label="Nom de l'offre" withAsterisk
                        {...form.getInputProps('title')}/>
                    <Textarea mb={'lg'} autosize label="Description" 
                        {...form.getInputProps('description')}/>
                    <NumberInput mb={'lg'} label="Durée de l'offre (mois)" min={0} withAsterisk
                        {...form.getInputProps('duration')}/>
                    <NumberInput mb={'xl'} min={0} rightSection={<BsCurrencyEuro />} withAsterisk
                        precision={2}
                        label="Prix" 
                        {...form.getInputProps('price')}/>
                    <Button className="tw-bg-gray-900 tw-text-white 
                        hover:tw-bg-black
                        tw-left-0 tw-right-0 tw-px-10 tw-py-2 
                        tw-border-[1px] tw-border-white tw-rounded-2xl
                        tw-absolute -tw-bottom-4 tw-mx-auto
                        "
                        type="submit"
                        disabled={loading}
                        >Ajouter</Button>
                </form>
            </MantineProvider>
        </>
    )
}