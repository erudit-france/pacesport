import { ActionIcon, Box, Button, Center, Divider, Flex, Modal, Space, Text, Title } from "@mantine/core";
import Head from "next/head";
import SearchSponsor from "../../components/SearchSponsor";
import UserListButton from "../../components/UserListButton";
import Layout from "../layout";
import SponsorInvitation from "../../components/SponsorInvitation";
import { GoPlus } from 'react-icons/go'
import Link from "next/link";
import { GrMoney } from "react-icons/gr";
import { BiMessage } from "react-icons/bi";
import CampagneCard from "../../components/CampagneCard";
import { BsMegaphoneFill, BsPeople } from 'react-icons/bs'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title as ChartTitle } from 'chart.js';
import { SlChart } from "react-icons/sl";

ChartJS.register(ArcElement, Tooltip, Legend, ChartTitle);

export default function Page(props){
    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Mon compte</title>
                <meta name="description" content="PACE&lsquo;SPORT" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className="tw-px-4 tw-pt-8 tw-relative">
                <Box className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-pt-12 tw-mt-4 tw-relative -tw-top-8 tw-z-0" p={'xl'}>
                    <Title order={3} align="center">Votre achat à bien été enregistré</Title>
                    <Center mt={'md'}>
                    <Link className="tw-border-[1px] tw-px-8 tw-py-0.5 tw-border-[#d61515] tw-rounded-xl tw-shadow-md hover:tw-bg-gray-100" 
                        href={props.prev}>Retour</Link>
                    </Center>

                </Box>
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
    if (avatar.code == 401) {
        return {
            redirect: {
            permanent: false,
            destination: "/login"
            }
        }
    }

    
    // // Pass data to the page via props
    return { props: {
        avatar: avatar.filename,
        prev: context.query.prev
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }