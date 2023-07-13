import { ActionIcon, Avatar, Badge, Box, Flex, Group, Select, Table, Tabs, Text, Title } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getAssociationPacesportPendingOffers } from "@/domain/repository/CardOffersRepository";
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { BsCheckLg } from "react-icons/bs";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";

export default function Page(props){
    const router = useRouter()
    const refresh = () => { router.reload(window.location.pathname) }
    const [offersPendingPacesport, setOffersPendingPacesport] = useState(props.offersPendingPacesport)

    const acceptOffer = (id) => {
        fetch(`/api/sponsoring-offer-admin-accept`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({offer: id})
          })
            .then(res => res.json())
            .then(res => {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => { Toast.error('Erreur') })
    }

    const declineOffer = (id) => {
        fetch(`/api/sponsoring-offer-admin-decline`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({offer: id})
          })
            .then(res => res.json())
            .then(res => {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => { Toast.error('Erreur') })
    }
    
    const ths = (
        <tr>
          <th>Sponsor</th>
          <th>Association</th>
          <th>Status</th>
          <th></th>
        </tr>
    )
    
    const rows = offersPendingPacesport.map((element) => (
        <tr key={element.id}>
            <td>
                <Group>
                    <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'}  src={`/uploads/${element.enseigne.avatar?.name}`} />
                    <Text fz={'sm'}>{element.enseigne.description}</Text>
                </Group>
            </td>
            <td>
                <Group>
                    <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'}  src={`/uploads/${element.association.avatar?.name}`} />
                    <Text fz={'sm'}>{element.description}</Text>
                </Group>
            </td>
            <td><Badge color="yellow" size="xs">En attente admin</Badge></td>
            <td>
                <Group>
                    
                    <ActionIcon variant="light" color="red"
                                size={'lg'}
                                onClick={() => declineOffer(element.id) }><ImCross /></ActionIcon>
                    <ActionIcon variant="light"
                        size={'lg'}
                        color="teal"
                        onClick={() => acceptOffer(element.id) }><BsCheckLg /></ActionIcon>
                </Group>
            </td>
        </tr>
    ))
    
    return (
        <>
            <Tabs.Panel value="offres" p={"md"}>
            <Flex justify={'space-between'} py={"sm"}>
                <Title order={4} align="center">Offres</Title>
                <Select
                    styles={ {
                        root: { display: 'flex', flexDirection: 'row' },
                        label: { display: 'flex', alignSelf: 'center', marginRight: '5px' }
                    }}
                    data={[
                        { value: 'all', label: 'Tout' },
                        { value: 'pendingPacesport', label: 'En attente admin' },
                        { value: 'pendingAssociation', label: 'En attente association' },
                        { value: 'active', label: 'actives' }
                    ]}
                    disabled
                    defaultValue="pendingPacesport"
                    label="Filtre"
                    placeholder="Sélectionner"
                    size="sm"
                    />
            </Flex>
            <Table striped withColumnBorders>
                <thead>{ths}</thead>
                <tbody>{rows}</tbody>
            </Table>
            </Tabs.Panel>
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

    let backgroundImage = await fetch(`${process.env.API_URL}/api/association/background`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
    backgroundImage = await backgroundImage.json();

    let offersPendingPacesport = await getAssociationPacesportPendingOffers(token)

    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        offersPendingPacesport: JSON.parse(offersPendingPacesport.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }