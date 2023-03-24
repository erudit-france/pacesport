import { Button, Flex, Modal, NumberInput, Text, Textarea, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Head from "next/head"
import Link from "next/link"
import Layout from "./layout"
import { useForm } from '@mantine/form';
import OffersList from "./components/OffersList"
import { getCookie } from "cookies-next"
import { serialize } from 'object-to-formdata';
import { showNotification } from "@mantine/notifications"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Page() {
    const [opened, { open, close }] = useDisclosure(false);
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        async function fetchData(){
            const res = await axios(
                '/api/discount-offer',
                {headers: { 'JWTAuthorization': `Bearer ${getCookie('token')}`}}
            );
            setOffers(JSON.parse(res.data.data))
        }
        fetchData()
    }, [offers]);

    const submitHandler = (values) => {
        console.log('submit values', values)
        fetch(`/api/discount-offer`, {
            method: 'POST',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: serialize(values)
          })
          .then(res => res.json())
          .then(res => {
            if (res.data) {
                showNotification({
                    title: 'Succès',
                    message: res.data.message,
                    color: 'teal'
                })
                close()
            }
            console.log('res', res)
        })
    }

    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            duration: 0,
            numberLimit: 0
        },
        validate: {
            title: (v) => v != '' ? null : 'Veuillez saisir un titre',
            description: (v) => v != '' ? null : 'Veuillez saisir une description',
            duration: (v) => v > 0 ? null : 'Veuillez saisir une durée de validité',
            numberLimit: (v) => v > 0 ? null : 'Veuillez saisir une limite valide'
        }
    });

    return (
        <>  
        <div className="tw-mx-3">
            <Flex className="tw-bg-gray-300 tw-shadow-inner tw-py-3 tw-rounded-t-xl border-3" px={'md'} justify={"space-between"}>
                <Text className="tw-text-gray-700 tw-uppercase tw-font-bold tw-text-[.9rem] tw-tracking-wide">Mes offres</Text>
                <Link href={''}>
                    <Button className="tw-bg-black tw-h-6 tw-font-semibold"
                            variant="filled" color={'dark'} size={'md'}
                            onClick={open}>Ajouter</Button>
                </Link>
            </Flex>
            <OffersList offers={offers} />

            <Modal opened={opened} onClose={close} title="Ajouter une offre de partenariat" centered>
                <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
                    <TextInput size="xs" mb={'sm'} label="Titre de l'offre"
                            withAsterisk
                            {...form.getInputProps('title')}/>
                    <Textarea size="xs" mb={'sm'} label="Description de l'offre"
                            autosize
                            withAsterisk
                            {...form.getInputProps('description')}/>
                    <NumberInput
                        mb={'sm'}
                        size="xs"
                        label="Durée de l'offre"
                        description="En mois"
                        withAsterisk
                        {...form.getInputProps('duration')}/>
                    <NumberInput
                        mb={'sm'}
                        size="xs"
                        label="Nombre d'offres"
                        withAsterisk
                        {...form.getInputProps('numberLimit')}/>

                    <Button className="tw-w-full tw-mx-auto tw-bg-teal-600 hover:tw-bg-teal-700" 
                        mt={'md'} radius={'lg'} size="sm" variant="filled" 
                        type="submit">Enregister</Button>
                </form>
            </Modal>
        </div>
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}