import { ActionIcon, Avatar, Badge, Box, Flex, Group, Select, Table, Tabs, Text, Title } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getActiveAssociations, getActiveSponsors, getAllAssociations, getAllSponsors, getPendingAssociations, getPendingSponsors } from "@/domain/repository/AdminRepository";
import { useState } from "react";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";
import { BsCheckLg, BsFillGearFill } from "react-icons/bs";
import { ImCross } from "react-icons/im";

export default function Page(props){
    const [sponsors, setSponsors] = useState(props.sponsors)
    const router = useRouter()
    const refresh = () => { router.reload(window.location.pathname) }

    const reloadFilter = async (val) => {
        switch (val) {
            case 'all':
                setSponsors(props.sponsors)
                break;
            case 'pending':
                setSponsors(props.pendingSponsors)
                break;
            case 'active':
                setSponsors(props.activeSponsors)
                break;
        }
    }

    const StatusBadge = ({sponsor}) => {
        let color = ''
        let text = ''
        if (sponsor.validated == true) {
            color = 'teal'
            text = 'Active'
        } else {
            color = 'yellow'
            text = 'En attente'
        } 
        return <Badge color={color} size="xs">{text}</Badge>
    }

    
    const ths = (
        <tr>
          <th>Sponsor</th>
          <th>Status</th>
          <th>Contrat</th>
        </tr>
    )
    
    const rows = sponsors.map((element) => (
        <tr key={element.id}>
            <td>
                <Group>
                    <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'}  src={`/uploads/${element.avatar?.name}`} />
                    <Text fz={'sm'}>{element.description}</Text>
                </Group>
            </td>
            <td>
                <StatusBadge sponsor={element} />
            </td>
            <td>
                <Group>
                    <ActionIcon variant="light" color="red"
                                size={'lg'}
                                onClick={() => declineSponsor(element.id) }><ImCross /></ActionIcon>
                    <ActionIcon variant="light"
                        size={'lg'}
                        color="teal"
                        onClick={() => acceptSponsor(element.id) }><BsCheckLg /></ActionIcon>
                </Group>
            </td>
        </tr>
    ))
    
    const acceptSponsor = (id) => {
        fetch(`/api/admin/sponsor/accept`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({sponsor: id})
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

    const declineSponsor = (id) => {
        fetch(`/api/admin/sponsor/decline`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({sponsor: id})
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

    return (
        <>
            <Tabs.Panel value="sponsors" p={"md"}>
            <Flex justify={'space-between'} py={"sm"}>
                <Title order={4} align="center">Comptes pro</Title>
                <Select
                    styles={ {
                        root: { display: 'flex', flexDirection: 'row' },
                        label: { display: 'flex', alignSelf: 'center', marginRight: '5px' }
                    }}
                    data={[
                        { value: 'all', label: 'Tout' },
                        { value: 'pending', label: 'En attente' },
                        { value: 'active', label: 'Actifs' }
                    ]}
                    onChange={reloadFilter}
                    defaultValue="all"
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
    let sponsors = await getAllSponsors(token)
    let pendingSponsors = await getPendingSponsors(token)
    let activeSponsors = await getActiveSponsors(token)

    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        sponsors: JSON.parse(sponsors.data),
        pendingSponsors: JSON.parse(pendingSponsors.data),
        activeSponsors: JSON.parse(activeSponsors.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }