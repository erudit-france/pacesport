import Head from "next/head";
import Layout from "./layout";
import { useEffect, useState } from 'react';
import { Stepper, Button, Group, TextInput, Text, Box, NumberInput, Flex, Modal, Skeleton, Progress, Title, Dialog, Space, Spoiler, Image, Accordion } from '@mantine/core';
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
import RemainingOffersDialog from "./components/RemainingOffersDialog";
import AccordionLabel from "./components/AccordionLabel";
import { BiMessage } from "react-icons/bi";
import Toast from '@/services/Toast'
import CampagneHeaderEditable from "@/components/CampagneHeaderEditable";
import fileUploader from "@/utils/fileUploader";
import { useRouter } from "next/navigation";

export default function Page(){
    const [imageFile, setImageFile] = useState(null)
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(33)
    const [page, setPage] = useState(1)
    const { push } = useRouter()
    
    const postCard = () => {
        let body = {...form1.values, ...form2.values}
        body = serialize(body)

        fileUploader(imageFile)
            .then((response) => {
                body.append('filename', response.data.filename)
                fetch(`/api/discount-card`, {
                    method: 'POST',
                    type: 'cors',
                    headers: new Headers({
                      'JWTAuthorization': `Bearer ${getCookie('token')}`
                    }),
                    body: body
                  })
                  .then(res => res.json())
                    .then(res => {
                        if (res.code == 401) push('/login')
                        console.log('res', res.data)
                        if (res.data.code == 1) {
                            Toast.success(res.data.message)
                            setTimeout(() => {
                                push('/profil/association')
                            }, 2000)
                        } else {
                            Toast.error(res.data.message)
                        }
                    })
                    .catch((error) => { 
                        Toast.error('Erreur pendant la création de la carte') 
                        console.log('error', error)
                    })
            });
    }

    const submitHandler = () => {
        // upload image
        postCard()
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
            <CampagneHeaderEditable image={image} setImage={setImage} setImageFile={setImageFile}/>
            <main className="tw-bg-gradient-to-b tw-from-gray-100 tw-to-white tw-rounded-t-[2rem] tw-relative -tw-mt-7"
                style={{ minHeight: 'calc(100vh - 180px)' }}>
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
                                                    dropdownType="modal"
                                                    label="Date début" size="xs" inputFormat="DD/MM/YYYY" 
                                                    onChange={(value) => dateDebutHandler(value)} withAsterisk
                                                    {...form1.getInputProps('dateDebut')}/>
                                        <DatePicker locale="fr" placeholder="Choisir une date" 
                                                    dropdownType="modal"
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
                                    <Text size={'sm'} className="tw-font-semibold">Montant {form2.values.prix}€</Text>
                                    <Text size={'sm'}>Nombre de cartes: {form2.values.offres}</Text>
                                </Flex>
                            </Flex>
                        </div>
                    }
                    
                    <Button className="tw-w-full tw-mx-auto tw-bg-teal-600 hover:tw-bg-teal-700 disabled:tw-border-2 disabled:tw-border-gray-100" 
                        mt={'md'} radius={'lg'} size="sm" variant="filled" 
                        onClick={() => submitHandler()}>Enregister</Button>
                </section>  

                <Space h={'xl'} my={'xl'} />

                <Box mt={'md'}>
                    <Title align="center" color="white" className="tw-bg-red-600 tw-font-light tw-pb-1" order={6}>Nouvelles offres de partenariat</Title>
                    <Accordion chevronPosition="right" variant="contained">
                        {/* <AccordionComponent id={'Carol'} label={'Auchan'} content={'lorem ipsum'} image={null} />
                        <AccordionComponent id={'Carol'} label={'Grand Frais'} content={'lorem ipsum'} image={null} />
                        <AccordionComponent id={'Carol'} label={'Leclerc'} content={'lorem ipsum'} image={null} /> */}
                    </Accordion>
                </Box>       

                <Box mt={'md'}>
                    <Title align="center" color="white" className="tw-bg-red-600 tw-font-light tw-pb-1" order={6}>Offres validées de partenaire</Title>
                </Box>  

                <Space h={'xl'} mt={'xl'} />
                <Space h={'xl'} mt={'xl'} />
                <Space h={'xl'} mt={'xl'} />
                <RemainingOffersDialog remainingOffers={3} />
            </main>
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }