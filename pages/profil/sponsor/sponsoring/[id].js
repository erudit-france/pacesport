import Head from "next/head";
import Layout from "./layout";
import PreviousPageButton from "@/components/PreviousPageButton";
import { Box, Button, Center, Container, Divider, Flex, Group, Text, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { serialize } from "object-to-formdata";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";
import moment from "moment";

export default function Page(props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            description: '',
        },
        validate: {
          description: (value) => (value != '' ? null : 'Veuillez saisir une description'),
        },
    });
  
    const submitHandler = (values) => {
        setLoading(true)
        let body = serialize({...values, offerId: props.sponsoringOffer.id});
        console.log('body', body)
        fetch(`/api/sponsoring-offer-proposition`, {
            method: 'POST',
            headers: new Headers({
            'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: body
        })
        .then(res => res.json())
        .then(res => {
            if (res.data) {
            Toast.success(res.data.message)
            router.push(props.previousUrl)
            }
        })
        .catch((error) => { Toast.error('Erreur pendant l\'enregistrement de l\'offre') })
        form.reset();
        setLoading(false)
    }

    
    const PropositionSection = () => {
        if (props.proposition == null) {
          return (
            <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
                <Textarea autosize label="Description" withAsterisk minRows={4} radius={'md'}
                            {...form.getInputProps('description')} />
                <Flex justify={'center'} mt={'md'}>
                    <Button className="tw-mx-auto tw-bg-lime-600 hover:tw-bg-teal-600" 
                    radius={'lg'} size="sm" variant="filled" 
                    type="submit" disabled={loading}>Envoyer</Button></Flex>
            </form>
          )
        } else {
            return (
                <>
                    <Textarea autosize label="Créée le" radius={'md'} readOnly
                        value={moment(props.proposition.createdAt).format('DD/MM/YYYY')} />
                    <Textarea autosize label="Description " 
                        minRows={4} radius={'md'} value={props.proposition.description} readOnly/>
                    {props.proposition.accepted == true
                        ? props.proposition.paid
                            ? <Text className="tw-bg-green-200/80" fz={'sm'} align="center">Validée et payée</Text>
                            : <><Text align="center" fz={'sm'} className="tw-bg-yellow-200/60">En attente de paiement</Text>
                                <Center><Button component="a" href="" className="tw-my-2 tw-mx-auto tw-bg-lime-600 hover:tw-bg-teal-600" 
                                    radius={'lg'} size="sm" variant="filled">Payer</Button></Center>
                                </>
                        : <Text>En attente d&lsquo;une réponse</Text>
                    }
                </>
                )
        }   
    }

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Partenariat</title>
            </Head>
            <main className="tw-bg-gradient-to-b tw-from-gray-100 tw-to-white tw-rounded-t-[2rem] tw-relative tw-shadow-inner -tw-mt-7"
                style={{ minHeight: 'calc(100vh - 180px)' }}>
                <section className="tw-px-4 tw-pt-4">
                    <Container>
                        <Center pos={'relative'} my={'xl'}>
                            <PreviousPageButton href={props.previousUrl}  className={'tw-absolute tw-left-5'} /> 
                            <Title order={4}>Offre de sponsoring</Title>
                        </Center>
                        <Divider mt={'md'} mb={'xl'}/>
                        <Flex justify={'space-between'}>
                            <Title order={6}>{props.sponsoringOffer.title}</Title>
                            <Text fz={'sm'}>{props.sponsoringOffer.duration} mois</Text>
                        </Flex>
                        <Text>{props.sponsoringOffer.description}</Text>
                        <Group>
                            <Text fz={'sm'}>Prix</Text>
                            <Text>{props.sponsoringOffer.price}€</Text>
                        </Group>

                        <Divider my={'lg'} />
                        
                        <Box  className="tw-border-[1] tw-border-t-red-600 tw-border-b-red-600">
                        <Title order={6} align="left">Mon offre</Title>
                            <PropositionSection />
                        </Box>
                    </Container>
                </section>
            </main>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let url = context.req.headers.referer
    let previousUrl = url === undefined ? '/profil/sponsor/' : url
    let id = context.query.id

    let sponsoringOffer = await fetch(`${process.env.API_URL}/api/sponsoring-offer/${id}`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    sponsoringOffer = await sponsoringOffer.json();
    
    let proposition = await fetch(`${process.env.API_URL}/api/sponsoring-offer-propositions/pending/${id}`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    proposition = await proposition.json();

      // // Pass data to the page via props
    return { props: { 
        sponsoringOffer: JSON.parse(sponsoringOffer.data),
        proposition: proposition.data ? JSON.parse(proposition.data) : null,
        previousUrl: previousUrl
    } }
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }