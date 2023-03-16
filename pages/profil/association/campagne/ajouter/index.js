import Head from "next/head";
import Layout from "./layout";
import { useEffect, useState } from 'react';
import { Stepper, Button, Group, TextInput, Text, Box, NumberInput, Flex, Modal, Skeleton } from '@mantine/core';
import { DateInput, DatePicker } from '@mantine/dates'
import { useForm } from '@mantine/form';
import 'dayjs/locale/fr';
import AssociatedOffersList from "../components/AssociatedOffersList";
import AvailableOffersList from "../components/AvailableOffersList";

export default function Page(){
    const minOffers = 5
    const [opened, setOpened] = useState(false);
    const [loadingOffers, setLoadingOffers] = useState(true);
    const [associatedOffers, setAssociatedOffers] = useState([]);
    const [associatedOffersError, setAssociatedOffersError] = useState(false);
    
    const submitHandler = (values) => {
        console.log('values', values)
        setAssociatedOffersError('')
        if (associatedOffers.length < values.nombreOffres) {
            setAssociatedOffersError('Le nombre de vos offres associées est en dessous du minimum')
        }
    }
    const form = useForm({
        initialValues: {
            nom: '',
        },
        validate: {
            nom: (v) => v != '' ? null : 'Veuillez saisir un nom',
            montant: (v) => v > -1 ? null : 'Veuillez saisir un montant valide',
            nombreOffres: (v) => v > -1 ? null : 'Veuillez saisir un nombre d\'offres valide',
            dateDebut: (v) => Date.parse(v) ? null : 'Veuillez saisir une date valide',
            dateFin: (v) => {
                if (!Date.parse(v)) {
                   return 'Veuillez saisir une date valide'
                }
                if (v < form.values.dateDebut) {
                   return 'La date de fin ne doit pas être inférieure à la date de début'
                }
            },
        },
    });

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Ajouter campagne</title>
            </Head>       
            <section className="tw-px-4 tw-pt-4">
                <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
                    <div className="tw-rounded-xl tw-border-[1px] tw-border-gray-400 tw-shadow-sm tw-p-3">
                        <h2 className="tw-font-semibold">Détails</h2>
                        <TextInput size="xs" mb={'sm'} label="Nom de la carte"
                                withAsterisk
                                {...form.getInputProps('nom')}/>
                        <NumberInput
                            mb={'sm'}
                            size="xs"
                            label="Montant carte"
                            description="En euro"
                            withAsterisk
                            {...form.getInputProps('montant')}/>
                        <NumberInput
                            mb={'sm'}
                            size="xs"
                            label="Nombre offres"
                            description={`Minimum ${minOffers} offres`}
                            min={minOffers}
                            withAsterisk
                            {...form.getInputProps('nombreOffres')}/>
                        <DatePicker locale="fr" placeholder="Choisir une date" 
                                    label="Date début" size="xs" inputFormat="DD/MM/YYYY" 
                                    onChange={(value) => dateDebutHandler(value)} withAsterisk
                                    {...form.getInputProps('dateDebut')}/>
                        <DatePicker locale="fr" placeholder="Choisir une date" 
                                    label="Date fin" size="xs" inputFormat="DD/MM/YYYY" 
                                    withAsterisk
                                    {...form.getInputProps('dateFin')}/>
                    </div>

                    <div className="tw-rounded-xl tw-border-[1px] tw-border-gray-400 tw-shadow-sm tw-p-3 tw-mt-2">
                        <Flex justify={'space-between'}>
                            <h2 className="tw-font-semibold">Offres associées</h2>
                            <Button onClick={() => { setOpened(true); setTimeout(() => {
                                setLoadingOffers(false)
                            }, 500); }} 
                                className="tw-bg-slate-900 hover:tw-bg-slate-700"
                                size="xs">
                                    Ajouter</Button>
                        </Flex>
                        <AssociatedOffersList associatedOffers={associatedOffers} setAssociatedOffers={setAssociatedOffers} className='tw-mt-2' />
                        {associatedOffersError &&
                            <Text className="tw-text-red-800 tw-bg-red-200/50 tw-rounded-lg tw-text-sm tw-p-3 tw-font-light">{associatedOffersError}</Text>
                        }
                    </div>
                        
                    <Button className="tw-w-full tw-mx-auto tw-bg-teal-600 hover:tw-bg-teal-700" 
                            mt={'md'} radius={'lg'} size="sm" variant="filled" 
                            type="submit">Enregister</Button>
                </form>
            </section>         

            <Modal
                centered 
                opened={opened}
                onClose={() => { setOpened(false); setLoadingOffers(true) }}
                title="Liste des offres disponibles"
            >
                {loadingOffers && 
                <Flex>
                    <div>
                        <Skeleton height={50} circle/>
                    </div>
                    <div className="tw-flex tw-flex-col tw-w-full tw-justify-around tw-ml-4">
                        <Skeleton height={8} width="50%" radius="xl" />
                        <Skeleton height={8} width="70%" radius="xl" />
                    </div>
                </Flex>}
                {!loadingOffers && <AvailableOffersList associatedOffers={associatedOffers} setAssociatedOffers={setAssociatedOffers} />}
            </Modal>

        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }