import { ActionIcon, Box, Button, Center, Divider, Flex, Loader, Modal, Overlay, Paper, Space, Text, TextInput, Title, useMantineTheme } from "@mantine/core";
import Head from "next/head";
import SearchSponsor from "./components/SearchSponsor";
import UserListButton from "./components/UserListButton";
import Layout from "./business/layout";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

export default function Page(props){
    const [loading, setLoading] = useState(false)
    const [openInvitationModal, { open, close }] = useDisclosure(false);
    const [additionalEmails, setAdditionalEmails] = useState([]);
    const isAccountLimited = true
    const nbSponsorsNeeded = 3
    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: {
          email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail'),
        },
    });

    const submitHandler = (values) => {
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

    const Cards = props.cards.map((card) => 
        <CampagneCard status={card.status} id={card.id} key={card.name + card.id} title={card.name} image={card.image?.name} startDate={card.startDate} />
    )
    const CardList = props.cards.length == 0
        ? <Text align="center" color="dimmed">Aucune carte enregistrée</Text>
        : Cards

    const AssociationSearchInvitation = () => <section className="tw-px-4 tw-pt-8 tw-relative">
        {isAccountLimited && 
            <Text fz={"sm"} className="tw-font-semibold" align="center" p='lg'>Votre accès est limité le temps que votre association soit validée</Text>}
        <SearchSponsor />
        <Flex mt={'md'} justify={'space-between'}>
            <UserListButton prev={'/profil/association'} />
            <Divider className="tw-border-gray-200 tw-mx-3 md:tw-mx-8" size="sm" orientation="vertical" />
            <SponsorInvitation />
        </Flex>
        <ActionIcon component='a' href='/communication/add/association?prev=/profil/association' className="tw-bg-white tw-absolute tw-right-4 tw-top-4 tw-p-1.5" radius={'xl'}>
            <BsMegaphoneFill className="tw-text-black" size={18} />
        </ActionIcon>
    </section>

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
                    <Title my={'md'} order={4} align="center">Asso 1</Title>
                    <ActionIcon component='a' href='/communication/add/association?prev=/profil/association' className="tw-bg-white tw-absolute tw-right-1.5 tw-bottom-0 tw-p-1.5" radius={'xl'}>
                        <BsMegaphoneFill className="tw-text-black" size={18} />
                    </ActionIcon>
                </Box>
                {/* <SponsorInvitation /> */}
            </section>

            <section className="tw-bg-white tw-mt-6 tw-shadow-inner tw-py-4 tw-px-4">
                <Flex justify={'space-between'} my={'lg'} className="tw-relative">
                    <Text className="tw-flex-1" color="red" fz={'sm'} fw={'bold'} align={'center'} py={2}>Ajoutez encore {nbSponsorsNeeded} partenaires pour valider votre pace&lsquo;sport</Text>
                </Flex>
                <CampagneCard status={1} id={1} title={'Titre carte'} image={props.avatar} startDate={Date.now()} />
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
                            Gestion de fonds</Button></Link>
            </section>  
                
            <Modal radius={'lg'} className="" opened={openInvitationModal} onClose={close} centered
                title={<Title className="tw-mx-auto" transform="uppercase" align="center" order={6}>Inviter des partenaires</Title>}>
                <Box align='' mt={'md'} p={'xs'}>
                    <form onSubmit={form.onSubmit((values) => submitHandler(values))} className="tw-my-4">
                        <TextInput mt="sm" variant="filled" className="" description="E-mail" placeholder="E-mail" radius="md" size="sm" withAsterisk
                            {...form.getInputProps('email')}/>
                            
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

    // if (hasActiveSubscriptionRes.data != null) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: "/profil/association/business",
    //         },
    //         props:{},
    //     };
    // }

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
    
    let cancelUrl = context.req.headers.referer
    let stripe = await fetch(`${process.env.API_URL}/api/stripe/subscriptionLinks`, {
        method: 'POST',
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        }),
        body: JSON.stringify({
            cancelUrl: `${process.env.NEXT_URL}${context.resolvedUrl}`,
            baseUrl: `${process.env.NEXT_URL}`
        })
    })
    stripe = await stripe.json();

    let backgroundImage = await fetch(`${process.env.API_URL}/api/association/background`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
    backgroundImage = await backgroundImage.json();

    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        cards: JSON.parse(cards.data),
        hasFinishedTutorial: JSON.parse(enseigne.data).hasFinishedTutorial,
        stripeMonthPaymentLink: stripe.monthUrl,
        stripeYearPaymentLink: stripe.yearUrl,
        hasActiveSubscription: hasActiveSubscriptionRes.data == null ? false : true
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }