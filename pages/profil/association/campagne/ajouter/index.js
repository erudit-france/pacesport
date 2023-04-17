import Head from "next/head";
import Layout from "./layout";
import { useEffect, useState } from 'react';
import { Stepper, Button, Group, TextInput, Text, Box, NumberInput, Flex, Modal, Skeleton, Progress, Title } from '@mantine/core';
import { DateInput, DatePicker } from '@mantine/dates'
import { useForm } from '@mantine/form';
import 'dayjs/locale/fr';
import AssociatedOffersList from "../components/AssociatedOffersList";
import AvailableOffersList from "../components/AvailableOffersList";
import { serialize } from "object-to-formdata";
import { getCookie } from "cookies-next";
import { showNotification } from "@mantine/notifications";
import moment from "moment/moment";
import PageStatusIndicator from "./components/PageStatusIndicator";


export default function Page(){
    const [progress, setProgress] = useState(33);
    const [page, setPage] = useState(1)
    const [opened, setOpened] = useState(false);
    const minOffers = 5
    const [loadingOffers, setLoadingOffers] = useState(true);
    const [associatedOffers, setAssociatedOffers] = useState([]);
    const [associatedOffersError, setAssociatedOffersError] = useState(false);
    
    const submitHandler = (values) => {
        const body = serialize(values)
        body.append('associatedOffers', JSON.stringify(associatedOffers))
        setAssociatedOffersError('')
        if (associatedOffers.length < values.nombreOffres) {
            setAssociatedOffersError('Le nombre de vos offres associées est en dessous du minimum')
        }
        fetch(`/api/discount-card`, {
            method: 'POST',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: body
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
            })
            .catch(error => showNotification({
                title: 'Erreur',
                message: 'Erreur pendant le création.' + error.message,
                color: 'red'
            }))      
    }

    const form1 = useForm({
        initialValues: {
            nom: '',
        },
        validate: {
            nom: (v) => v != '' ? null : 'Veuillez saisir un nom',
            dateDebut: (v) => Date.parse(v) ? null : 'Veuillez saisir une date valide',
            dateFin: (v) => {
                if (!Date.parse(v)) {
                   return 'Veuillez saisir une date valide'
                }
                if (v < form1.values.dateDebut) {
                   return 'La date de fin ne doit pas être inférieure à la date de début'
                }
            }
        }
    })

    const form2 = useForm({
        initialValues: {
            prix: 0,
            offres: 0,
        },
        validate: {
            prix: (v) => v > 0 ? null : 'Veuillez saisir un prix',
            offres: (v) => v > 0 ? null : 'Veuillez saisir un nombre d\'offres'
        }
    })

    const goToPage = (page) => {
        if (page == 1) setProgress(33)
        if (page == 2) setProgress(66)
        if (page == 3) setProgress(100)
        setPage(page)
    }

    const nextPage = (values, nextPage) => {
        if (nextPage == 2) {}
        if (nextPage == 3) {}
        goToPage(nextPage)
    }

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Ajouter campagne</title>
            </Head>       
            <section className="tw-px-4 tw-pt-4">
                <Progress className="tw-contrast-[.8]" mb={'lg'} mt={'sm'} color="teal" size="xl" value={progress} striped />
                <Title order={3} mb={'sm'}>Ajouter une carte</Title>
                {page == 1
                    ?
                    <form onSubmit={form1.onSubmit((values) => nextPage(values, 2))}>
                        <div className="tw-rounded-xl tw-border-[1px] tw-border-gray-400 tw-shadow-sm tw-p-3 tw-mt-2">
                            <Flex>
                                <PageStatusIndicator page={1} currentPage={page} relative={true}/>
                                <div className="tw-flex-1 tw-ml-3">
                                    <TextInput size="xs" mb={'sm'} label="Nom de la carte"
                                            withAsterisk
                                            {...form1.getInputProps('nom')}/>
                                    <DatePicker locale="fr" placeholder="Choisir une date" 
                                                label="Date début" size="xs" inputFormat="DD/MM/YYYY" 
                                                onChange={(value) => dateDebutHandler(value)} withAsterisk
                                                {...form1.getInputProps('dateDebut')}/>
                                    <DatePicker locale="fr" placeholder="Choisir une date" 
                                                label="Date fin" size="xs" inputFormat="DD/MM/YYYY" 
                                                withAsterisk
                                                {...form1.getInputProps('dateFin')}/>
                                </div>
                            </Flex>
                            <Flex justify={'center'}>
                                <Button type="submit" 
                                    mt={'xs'}
                                    size="xs" radius={'xl'}
                                    className="tw-border-[1] tw-border-gray-600 tw-text-gray-700
                                    tw-py-0 tw-px-8
                                    hover:tw-bg-gray-200">Suivant</Button>
                            </Flex>
                        </div>                        
                    </form>
                    :
                    <div className="tw-rounded-xl tw-border-[1px] tw-border-gray-400 tw-shadow-sm tw-p-3">
                        <Flex>
                            <PageStatusIndicator page={1} currentPage={page} relative={false}/>
                            <Flex direction={'column'} className="tw-flex-1 tw-ml-3">
                                <Text size={'sm'} className="tw-font-semibold">{form1.values.nom}</Text>
                                <Text size={'xs'}>Du {moment(form1.values.dateDebut).format('DD/MM/YYYY')} au {moment(form1.values.dateFin).format('DD/MM/YYYY')}</Text>
                            </Flex>
                        </Flex>
                    </div>
                }

                
                {page == 2
                    ?
                    <form onSubmit={form2.onSubmit((values) => nextPage(values, 3))} className="">
                        <div className="tw-rounded-xl tw-border-[1px] tw-border-gray-400 tw-shadow-sm tw-p-3 tw-mt-2">
                            <Flex>
                                <PageStatusIndicator page={1} currentPage={page} relative={true}/>
                                <div className="tw-flex-1 tw-ml-3">
                                    <NumberInput size="xs" mb={'sm'} label="Montant de la carte"
                                            withAsterisk
                                            {...form2.getInputProps('prix')}/>
                                    <NumberInput size="xs" mb={'sm'} label="Nombre d'offres"
                                            withAsterisk
                                            {...form2.getInputProps('offres')}/>
                                </div>
                            </Flex>
                            <Flex justify={'center'} mt={'xs'}>
                                <Button size="xs" radius={'xl'}
                                        className="tw-text-gray-700 hover:tw-bg-transparent
                                        tw-py-0 tw-px-8" onClick={() => goToPage(1)}>Retour</Button>
                                <Button type="submit" 
                                    size="xs" radius={'xl'}
                                    className="tw-border-[1] tw-border-gray-600 tw-text-gray-700
                                    tw-py-0 tw-px-8
                                    hover:tw-bg-gray-200">Suivant</Button>
                            </Flex>
                        </div>                        
                    </form>
                    :  
                    <div className="tw-rounded-xl tw-border-[1px] tw-border-gray-400 tw-shadow-sm tw-p-3 tw-mt-2">
                        <Flex>
                            <PageStatusIndicator page={2} currentPage={page} relative={false}/>
                            <Flex direction={'column'} className="tw-flex-1 tw-ml-3">
                                <Text size={'sm'} className="tw-font-semibold">Montant {form2.values.prix}</Text>
                                <Text size={'sm'}>Nombre de cartes {form2.values.offers}</Text>
                            </Flex>
                        </Flex>
                    </div>
                }
                
                <Button disabled
                            className="tw-w-full tw-mx-auto tw-bg-teal-600 hover:tw-bg-teal-700 disabled:tw-border-2 disabled:tw-border-gray-300" 
                            mt={'md'} radius={'lg'} size="sm" variant="filled" 
                            type="submit">Enregister</Button>
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
      <Layout >{page}</Layout>
    )
  }