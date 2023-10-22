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

export default function Page(props) {
    const isAccountLimited = false
    const Cards = props.cards.map((card) =>
        <CampagneCard status={card.status} id={card.id} key={card.name + card.id} title={card.name} image={card.image?.name} startDate={card.startDate} />
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
        <></>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token_v3']
    let avatar = await fetch(`${process.env.API_URL}/api/association/avatar`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    avatar = await avatar.json();

    let backgroundImage = await fetch(`${process.env.API_URL}/api/association/background`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
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
        })
    }
    )
    cards = await cards.json();

    // // Pass data to the page via props
    return {
        props: {
            avatar: avatar.filename,
            backgroundImage: backgroundImage.filename,
            cards: JSON.parse(cards.data)
        }
    }
}

Page.getLayout = function getLayout(page) {
    return (
        <Layout>{page}</Layout>
    )
}