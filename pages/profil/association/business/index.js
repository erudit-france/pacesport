import { ActionIcon, Box, Button, Center, Divider, Flex, Modal, Space, Text, Title } from "@mantine/core";
import Head from "next/head";
import SearchSponsor from "../components/SearchSponsor";
import UserListButton from "../components/UserListButton";
import Layout from "./layout";
import SponsorInvitation from "../components/SponsorInvitation";
import { GoPlus } from 'react-icons/go'
import Link from "next/link";
import { GrMoney } from "react-icons/gr";
import { BiMessage } from "react-icons/bi";
import CampagneCard from "../components/CampagneCard";
import { BsMegaphoneFill, BsPeople } from 'react-icons/bs'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title as ChartTitle } from 'chart.js';
import { SlChart } from "react-icons/sl";

ChartJS.register(ArcElement, Tooltip, Legend, ChartTitle);

export default function Page(props){
    const isAccountLimited = false
    const Cards = props.cards.map((card) => 
        <CampagneCard id={card.id} key={card.name + card.id} title={card.name} image={card.image?.name} startDate={card.startDate} />
    )
    const CardList = props.cards.length == 0
        ? <Text align="center" color="dimmed">Aucune carte enregistrée</Text>
        : Cards
        
    const pieData = {
        labels: ['Mécenats', 'Sponsoring'],
        datasets: [
        {
            label: '% Ventes',
            data: [25, 75],
            backgroundColor: [
            'rgba(199, 199, 199, 1)',
            'rgba(255, 255, 255, 1)',
            ],
            borderColor: [
            'rgba(170, 170, 170, 1)',
            'rgba(170, 170, 170, .8)',
            ],
            borderWidth: 1,
        },
        ],
    };

    const pieOptions = {
        plugins: {
            title: {
                display: true,
                text: 'Cette Saison',
            },
        },
        legend: {
            position: 'bottom',
            align: 'center'
        }
    }

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Mon compte</title>
                <meta name="description" content="PACE&lsquo;SPORT" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className="tw-px-4 tw-pt-8 tw-relative">
                {isAccountLimited && 
                    <Text fz={"sm"} className="tw-font-semibold" align="center" p='lg'>Votre accès est limité le temps que votre association soit validée</Text>}
                {!isAccountLimited && 
                    <Space py={'sm'} />}
                <SearchSponsor />
                <Flex mt={'md'} justify={'space-between'}>
                    <UserListButton prev='/profil/association/business' />
                    <Divider className="tw-border-gray-200 tw-mx-3 md:tw-mx-8" size="sm" orientation="vertical" />
                    <SponsorInvitation />
                </Flex>
                <ActionIcon component='a' href='/communication/add?prev=profil/association/business' className="tw-bg-white tw-absolute tw-right-4 tw-top-4 tw-p-1.5" radius={'xl'}>
                    <BsMegaphoneFill className="tw-text-black" size={18} />
                </ActionIcon>
            </section>

            <section className="tw-bg-white tw-mt-6 tw-shadow-inner tw-py-5 tw-px-4">
                <Flex justify={'space-between'} pb={'sm'}>
                    <Text fz={'sm'} fw={'bold'} align={'center'} transform={'uppercase'} py={2}>Mon Pace&lsquo;sport</Text>
                    <Link href="/profil/association/campagne/ajouter">
                        <Button size="xs" rightIcon={<GoPlus size="1rem" />}
                            className="tw-bg-gray-900 tw-text-gray-100 tw-text-xs tw-rounded-xl
                                        hover:tw-bg-black" 
                            >
                            Nouvelle campagne
                        </Button>
                    </Link>
                </Flex>
                <Box>{CardList}</Box>
            </section>

            <Space className="tw-mt-1"></Space>

            <section className="tw-bg-lightgold-50 tw-flex tw-flex-col tw-py-4">
                <Flex justify={'center'} color="white" align={'center'} pos={'relative'}>
                    <BsPeople color="white" className="tw-mr-1" size={20}/>
                    <Text color="white" align="center">
                        Suivi des partenariats
                    </Text>

                    <Link href={'/gestion-fonds/statistiques?prev=/profil/association/business'}><Button variant="filled" size="sm"
                        className="tw-bg-gray-100 tw-text-black tw-border-[1px] tw-border-gray-600 tw-shadow-sm
                        tw-absolute tw-right-3 -tw-top-1
                        tw-h-8
                        hover:tw-bg-gray-200 hover:tw-text-black" 
                        radius={'xl'}><SlChart /></Button></Link>
                </Flex>
                
                <Center p={'lg'} mah={280}>
                    <Pie data={pieData} options={pieOptions}/>
                </Center>
            </section>

            
            <section className="tw-flex tw-flex-col tw-py-4 tw-bg-red-700/80">
                <Link href='/messages' className="tw-mx-auto tw-mt-3">
                    <Button color="white" variant="filled" size="sm" leftIcon={<BiMessage />} miw={200}
                        className="tw-bg-white tw-text-black hover:tw-bg-gray-200" radius={'lg'}>
                            Messagerie</Button></Link>
                <Link href='/gestion-fonds?prev=/profil/association/business' className="tw-mx-auto tw-mt-3">
                        <Button color="white" variant="filled" size="sm" leftIcon={<GrMoney />} miw={200}
                        className="tw-bg-white tw-text-black hover:tw-bg-gray-200" radius={'lg'}>
                            Gestion de fonds</Button></Link>
            </section>
                
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let avatar = await fetch(`${process.env.API_URL}/api/association/avatar`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
    )
    avatar = await avatar.json();
    
    let backgroundImage = await fetch(`${process.env.API_URL}/api/association/background`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
    backgroundImage = await backgroundImage.json();

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
    
    // // Pass data to the page via props
    return { props: {
        avatar: avatar.filename,
        backgroundImage: backgroundImage.filename,
        cards: JSON.parse(cards.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }