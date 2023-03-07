import Head from "next/head";
import Layout from "./layout";
import { useState } from 'react';
import { Stepper, Button, Group, TextInput, Text, Box } from '@mantine/core';
import { DateInput, DatePicker } from '@mantine/dates'
import 'dayjs/locale/fr';

export default function Page(){
    const [nom, setNom] = useState('');
    const [dateDebut, setDateDebut] = useState(new Date());
    const [dateFin, setDateFin] = useState(dateDebut + 1);
    const dateDebutHandler = (value) => {
        setDateDebut(value)
        setDateFin(dateDebut + 1)
    }

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Ajouter campagne</title>
            </Head>       
            <section className="tw-px-4 tw-pt-4">
                <TextInput size="xs" mb={'sm'} label="Nom de la carte" value={nom} withAsterisk/>
                <Text size={'xs'}>Durée de validité</Text>
                <Box mx={'xs'}>
                    <DatePicker locale="fr" placeholder="Choisir une date" 
                                label="Du" size="xs" inputFormat="DD/MM/YYYY" 
                                onChange={(value) => dateDebutHandler(value)} withAsterisk/>
                    <DatePicker locale="fr" placeholder="Choisir une date" 
                                label="Au" size="xs" inputFormat="DD/MM/YYYY" 
                                value={dateFin}
                                minDate={dateDebut}
                                withAsterisk
                                />
                </Box>
            </section>         

        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }