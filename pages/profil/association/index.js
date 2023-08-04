import { ActionIcon, Box, Button, Center, Divider, FileInput, Flex, List, Loader, Modal, Overlay, Paper, Space, Text, TextInput, Title, useMantineTheme } from "@mantine/core";
import Head from "next/head";
import SearchSponsor from "./components/SearchSponsor";
import UserListButton from "./components/UserListButton";
import Layout from "./layout";
import SponsorInvitation from "./components/SponsorInvitation";
import { GoPlus } from 'react-icons/go'
import Link from "next/link";
import { BsLink, BsLock, BsMegaphoneFill } from "react-icons/bs";
import { GrMoney } from "react-icons/gr";
import { BiMessage } from "react-icons/bi";
import CampagneCard from "./components/CampagneCard";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useForm } from "@mantine/form";
import { serialize } from "object-to-formdata";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { AiOutlineFileText } from "react-icons/ai";
import { getAssociationInvitationRequest, getAssociationSponsorInvitations } from "@/domain/repository/AssociationRepository";
import fileUploader from "@/utils/fileUploader";
import { getUser } from "@/domain/repository/UserRepository";
import { getPacesportCard } from "@/domain/repository/PacesportRepository";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

export default function Page(props){
    const validationRequest = props.validationRequest
    const [loading, setLoading] = useState(false)
    const [openInvitationModal, { open, close }] = useDisclosure(false);
    const [additionalEmails, setAdditionalEmails] = useState([]);
    const [contrat, setContrat] = useState(null)
    const [hasEnoughOffers, setHasEnoughOffers] = useState(props.invitations.length > 0)
    const [hasUploadedStatus, setHasUploadedStatus] = useState(false)
    const isAccountLimited = true
    const nbSponsorsNeeded = 3
    
    const form = useForm({
        initialValues: {
          statut: '',
        },
        validate: {
          statut: (value) => (value instanceof File ? null : 'Veuillez importer un fichier'),
        },
    });

    const submitHandler = (values) => {
        setLoading(true)        
        fileUploader(values.statut)
            .then((response) => {
                let body = new FormData();
                body.append('filename', response.data.filename)
                fetch(`/api/association/validation-request`, {
                    method: 'POST',
                    type: 'cors',
                    headers: new Headers({
                      'JWTAuthorization': `Bearer ${getCookie('token')}`
                    }),
                    body: body
                  })
                  .then(res => res.json())
                    .then(res => {
                        res.data.code == 1 
                            ? Toast.success(res.data.message)
                            : Toast.error(res.data.message)
                        setLoading(false)
                    })
                    .catch((error) => { 
                        Toast.error('Erreur pendant l\'enregistrement de la demande') 
                        setLoading(false)
                    })
                .catch((error) => { 
                    Toast.error('Erreur pendant le téléchargement du fichier') 
                    setLoading(false)
                })
            });
    }

    const emailForm = useForm({
        initialValues: {
            email: '',
        },
        validate: {
          email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail'),
        },
    });

    const emailSubmitHandler = (values) => {
        setLoading(true)
        let body = serialize(values)
        fetch(`/api/mail/invitation`, {
            method: 'POST',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: body
          }).then(res => res.json())
                .then(res => {
                    if(res.data) {
                        Toast.success('Invitation envoyée')
                    }
                    setLoading(false)
                    close()
                })
            .catch((error) => { 
                Toast.error('Erreur pendant l\'envoi du mail') 
                setLoading(false)
                close()
            })
    }

    const labels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'];
    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            text: '',
          },
        },
    };
    const ChartData = {
        labels,
        datasets: [
          {
            label: '',
            data: labels.map(() => (Math.random() * (15 - 2)).toFixed(0)),
            backgroundColor: 'rgba(150, 150, 150, 0.8)',
          },
        ],
      };

    const ChartSection = (props) => <Center {...props}>
        <Bar options={options} data={ChartData} />
    </Center>

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Mon compte</title>
                <meta name="description" content="PACE&lsquo;SPORT" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <section className="tw-px-4 tw-pt-8 tw-relative">
                <Box className="tw-relative">
                    <Title my={'md'} order={4} align="center">Carte</Title>
                    <ActionIcon component='a' href='/communication/add/association?prev=/profil/association' className="tw-bg-white tw-absolute tw-right-1.5 tw-bottom-0 tw-p-1.5" radius={'xl'}>
                        <BsMegaphoneFill className="tw-text-black" size={18} />
                    </ActionIcon>
                </Box>
                {/* <SponsorInvitation /> */}
            </section>

            <section className="tw-bg-white tw-mt-6 tw-shadow-inner tw-py-4 tw-px-4">
                    {validationRequest?.validated == false && <Center className="tw-z-50"><Text color="orange">Votre demande est en attente de validation</Text></Center>}
                    {validationRequest?.validated == false &&
                        <form className="tw-relative" onSubmit={form.onSubmit((values) => submitHandler(values))}>
                        {validationRequest && <Overlay className="tw-rounded-3xl tw-mx-1 tw-mb-1"  opacity={0.1} color="#000" blur={1} />}
                        <Box className="tw-border-[1px] tw-border-gray-300 tw-shadow-sm tw-rounded-3xl" mx={'xs'} px={'md'} py={'md'}>
                                <Text fz={'sm'} mb={'sm'}>Nb offres: <span>3</span></Text>
                                <FileInput
                                    className="placeholder:tw-text-red-500"
                                    rightSection={<AiOutlineFileText className="tw-text-gray-800" size={18} />}
                                    placeholder="Ajouter un fichier"
                                    label="Statut"
                                    withAsterisk
                                    mb={'sm'}
                                    {...form.getInputProps('statut')}/>
                                <List className="tw-list-disc" type="unordered" size={'sm'} mt={'md'}>
                                    <List.Item className={hasEnoughOffers ? 'tw-text-emerald-600/80' : 'tw-text-red-500'}>
                                        Vous avez au moins 3 offres</List.Item>
                                    <List.Item className={hasUploadedStatus ? 'tw-text-emerald-600/80' : ''}>
                                        Vous avez joint vos statuts</List.Item>
                                    <List.Item className="">
                                        <Link className="tw-text-blue-600 hover:tw-text-blue-700 tw-underline" target="_blank" 
                                            href="/Contrat_partenaire_PACESPORT.pdf">Contrat à remplir et joindre</Link>
                                    </List.Item>
                                </List>
                        </Box>
                        <Center>
                            <Button type="submit" size="xs" 
                                    className="tw-border-[1px] tw-border-gray-300 tw-bg-white tw-text-gray-600 
                                    tw-text-xs tw-rounded-3xl tw-px-10 tw-h-8 tw-mt-4 tw-mb-5 tw-shadow-md
                                    hover:tw-bg-gray-200"
                                    disabled={loading || validationRequest != null }>
                                    Envoyer pour  validation</Button>
                        </Center>
                        </form>}
                    {validationRequest?.validated == false && <Text color="green" align="center">Association validée</Text>}
                {validationRequest?.validated == false && 
                    <Flex justify={'space-between'} my={'lg'} className="tw-relative">
                        <Text className="tw-flex-1" color="red" fz={'sm'} fw={'bold'} align={'center'} py={2}>Ajoutez encore {nbSponsorsNeeded} partenaires pour valider votre pace&lsquo;sport</Text>
                    </Flex>}
                <CampagneCard status={1} id={1} title={'Carte pacesport'} image={props.pacesportCard?.image?.name} startDate={Date.now()} />
                <Divider  my={'sm'} className="tw-w-2/3 tw-mx-auto"/>
                
                <Center>
                    <Button size="xs" 
                        onClick={() => open(true)}
                        className="tw-bg-orange-700/90 tw-text-gray-100 tw-text-xs tw-rounded-3xl tw-px-10 tw-h-6 tw-my-2 tw-shadow-md
                        hover:tw-bg-orange-700">
                        Inviter des partenaires par email</Button>
                </Center>
            </section>

            <Box className="tw-bg-white tw-w-[110%] tw-h-8 -tw-skew-y-3 tw-relative -tw-top-4"></Box>

            <Space className="tw-pt-3"></Space>
            <Box className="tw-relative">
                <Paper color="white" className="tw-absolute -tw-top-4 tw-left-0 -tw-z-1 tw-w-[110%] tw-h-[110%] -tw-skew-y-3" />
                <ChartSection className="tw-bg-white tw-p-10 tw-z-10 tw-relative" />
            </Box>
            <Space className="tw-mt-8"></Space>

            {/* <section className="tw-bg-lightgold-50 tw-flex tw-flex-col tw-py-4">
                <Text color="white" align="center">Offre de sponsoring</Text>
                <Text className="tw-flex tw-justify-center" align="center">Uniquement avec Pace&lsquo;sport Business<BsLock className='tw-my-auto tw-ml-1'/></Text>
                <Button onClick={open} color="white" variant="filled" size="xs" 
                    className="tw-bg-white tw-text-black hover:tw-bg-gray-200 tw-mx-auto tw-mt-3" radius={'lg'}>En savoir plus</Button>
            </section> */}

            
            <section className="tw-flex tw-flex-col tw-py-4 tw-bg-red-700/30">
                <Link href='/messages' className="tw-mx-auto tw-mt-3">
                    <Button color="white" variant="filled" size="sm" leftIcon={<BiMessage />} miw={200}
                        className="tw-bg-white tw-text-black hover:tw-bg-gray-200" radius={'lg'}>
                            Messagerie</Button></Link>
                <Link href='/gestion-fonds?prev=/profil/association' className="tw-mx-auto tw-mt-3">
                        <Button color="white" variant="filled" size="sm" leftIcon={<GrMoney />} miw={200}
                        className="tw-bg-white tw-text-black hover:tw-bg-gray-200" radius={'lg'}>
                            Gestion des fonds</Button></Link>
            </section>  
                
            <Modal radius={'lg'} className="" opened={openInvitationModal} onClose={close} centered
                title={<Title className="tw-mx-auto" transform="uppercase" align="center" order={6}>Inviter des partenaires</Title>}>
                <Box align='' mt={'md'} p={'xs'}>
                    <form onSubmit={emailForm.onSubmit((values) => emailSubmitHandler(values))} className="tw-my-4">
                        <TextInput mt="sm" variant="filled" className="" description="E-mail" placeholder="E-mail" radius="md" size="sm" withAsterisk
                            {...emailForm.getInputProps('email')}/>
                            
                        <Center>
                            <Button type="submit" size="xs" 
                                    disabled={loading}
                                    className="tw-bg-gold-400/90 tw-text-gray-100 tw-text-xs tw-rounded-3xl tw-px-10 tw-h-8 tw-mt-8 tw-shadow-md
                                    hover:tw-bg-gold-400">
                                    { loading ? <Loader color="orange" size="xs" /> : ' Envoyer'}</Button>
                        </Center>
                    </form>
                </Box>
            </Modal>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']

    
    let hasActiveSubscriptionRes = await fetch(`${process.env.API_URL}/api/user/hasActiveSubscription`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    hasActiveSubscriptionRes = await hasActiveSubscriptionRes.json();

    let avatar = await fetch(`${process.env.API_URL}/api/association/avatar`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
    )
    avatar = await avatar.json();
    if (avatar.code == 401) {
        return {
            redirect: {
            permanent: false,
            destination: "/login"
            }
        }
    }

    let cards = await fetch(`${process.env.API_URL}/api/discount-card/association/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    cards = await cards.json();

    let enseigne = await fetch(`${process.env.API_URL}/api/enseigne/auth/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    enseigne = await enseigne.json();

    let backgroundImage = await fetch(`${process.env.API_URL}/api/association/background`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
    backgroundImage = await backgroundImage.json();

    let invitations = await getAssociationSponsorInvitations(token)
    let validationRequest = await getAssociationInvitationRequest(token)
    let user = await getUser(token)
    let pacesport = await getPacesportCard(token)


    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        cards: JSON.parse(cards.data),
        hasFinishedTutorial: JSON.parse(enseigne.data).hasFinishedTutorial,
        hasActiveSubscription: hasActiveSubscriptionRes.data == null ? false : true,
        invitations: JSON.parse(invitations.data),
        validationRequest: JSON.parse(validationRequest.data),
        user: JSON.parse(user.data),
        pacesportCard: JSON.parse(pacesport.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }