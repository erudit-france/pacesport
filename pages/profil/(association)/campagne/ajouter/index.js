import Head from "next/head";
import Layout from "./layout";
import { useState } from 'react';
import { Stepper, Button, Group, TextInput, Text, Box, NumberInput } from '@mantine/core';
import { DateInput, DatePicker } from '@mantine/dates'
import { useForm } from '@mantine/form';
import 'dayjs/locale/fr';

export default function Page(){
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
                if (v < dateDebut) {
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
                <form onSubmit={form.onSubmit((values) => console.log(values))}>
                    <div className="rounded tw-border-[1px] tw-border-gray-400 tw-shadow-sm tw-p-3">
                        <h2>Détails</h2>
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
                            description="Minimum 5 offres"
                            min={5}
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

                    <div className="rounded tw-border-[1px] tw-border-gray-400 tw-shadow-sm tw-p-3 tw-mt-2">
                        <h2>Offres associées</h2>

                    </div>
                        
                    <Button className="tw-w-full tw-mx-auto tw-bg-gray-800" 
                            mt={'md'} radius={'lg'} size="sm" variant="filled" 
                            color={"dark"} type="submit">Enregister</Button>
                </form>
            </section>         

        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }