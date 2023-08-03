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
import Link from "next/link";
import { getUser } from "@/domain/repository/UserRepository";

export default function Page(props){
    const [associations, setAssociations] = useState(props.associations)
    const router = useRouter()
    const refresh = () => { router.reload(window.location.pathname) }

    const reloadFilter = async (val) => {
        switch (val) {
            case 'all':
                setAssociations(props.associations)
                break;
            case 'pending':
                setAssociations(props.pendingAssociations)
                break;
            case 'active':
                setAssociations(props.activeAssociations)
                break;
        }
    }

    const StatusBadge = ({association}) => {
        let color = ''
        let text = ''
        if (association.validated == null) {
            color = 'yellow'
            text = 'En attente'
        } else if (association.validated == true) {
            color = 'teal'
            text = 'Active'
        } else if (association.validated == false) {
            color = 'gray'
            text = 'Refusée'
        }
        return <Badge color={color} size="xs">{text}</Badge>
    }

    
    const ths = (
        <tr>
          <th>Association</th>
          <th>Status</th>
          <th>Contrat</th>
        </tr>
    )
    
    const rows = associations.map((element) => (
        <tr key={element.id}>
            <td>
                <Group>
                    <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'}  src={`/uploads/${element.avatar?.name}`} />
                    <Text fz={'sm'}>{element.description}</Text>
                </Group>
            </td>
            <td>
                <StatusBadge association={element} />
            </td>
            <td>
                {element.contrat != null &&
                    <Link className="tw-text-blue-400 tw-text-sm tw-font-light tw-underline" 
                        href={`/uploads/${element.contrat.name}`} target='_blank'>{element.contrat.name}</Link>
                }
            </td>
            <td>
                <Group>
                    <ActionIcon variant="light" color="red"
                                size={'lg'}
                                onClick={() => declineAssociation(element.id) }><ImCross /></ActionIcon>
                    <ActionIcon variant="light"
                        size={'lg'}
                        color="teal"
                        onClick={() => acceptAssociation(element.id) }><BsCheckLg /></ActionIcon>
                </Group>
            </td>
        </tr>
    ))
    
    const acceptAssociation = (id) => {
        fetch(`/api/admin/association/accept`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({association: id})
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

    const declineAssociation = (id) => {
        fetch(`/api/admin/association/decline`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({association: id})
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
            <Tabs.Panel value="associations" p={"md"}>
            <Flex justify={'space-between'} py={"sm"}>
                <Title order={6} align="left">Comptes associations</Title>
                <Select
                    styles={ {
                        root: { display: 'flex', flexDirection: 'row' },
                        label: { display: 'flex', alignSelf: 'center', marginRight: '5px', fontSize: '13px' }
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
                    size="xs"
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
    let associations = await getAllAssociations(token)
    let pendingAssociations = await getPendingAssociations(token)
    let activeAssociations = await getActiveAssociations(token)
    let user = await getUser(token)
    user = JSON.parse(user.data)
    if (!user.roles.includes('ROLE_ADMIN')) {
        return {
            redirect: {
            permanent: false,
            destination: "/login/as"
            }
        }
    }

    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        associations: JSON.parse(associations.data),
        pendingAssociations: JSON.parse(pendingAssociations.data),
        activeAssociations: JSON.parse(activeAssociations.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }