import { ActionIcon, Avatar, Badge, Box, Button, CopyButton, Divider, Flex, Group, Modal, ScrollArea, Select, Table, Tabs, Text, Title, Tooltip } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getActiveAssociations, getActiveSponsors, getAllAssociations, getAllSponsors, getPendingAssociations, getPendingSponsors } from "@/domain/repository/AdminRepository";
import { useState } from "react";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";
import { BsCheckLg, BsFillGearFill, BsTrash } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import Link from "next/link";
import { getUser } from "@/domain/repository/UserRepository";
import { TbCheck, TbCopy } from "react-icons/tb";

const Information = ({label, value}) => (
    <Flex className="tw-text-sm tw-mt-1">
        <Text>{label}:</Text>
        <Text ml={'lg'} weight={400}>{value}</Text>
        {label == 'Email' &&
            <CopyButton value={value} timeout={1500}>
                {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copié' : 'Copier'} withArrow position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                        {copied ? <TbCheck size={14} /> : <TbCopy size={14} />}
                    </ActionIcon>
                    </Tooltip>
                )}
            </CopyButton>
        }
    </Flex>
)
export default function Page(props){
    const [loading, setLoading] = useState(false)
    const [openAssociation, setOpenAssociation] = useState(null)
    const [associations, setAssociations] = useState(props.associations)
    const router = useRouter()
    const refresh = () => { 
        router.reload(window.location.pathname) 
    }

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
          <th className="tw-capitalize">état</th>
          <th>Status</th>
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
                {element.status != null &&
                    <Link className="tw-text-blue-400 tw-text-sm tw-font-light tw-underline" 
                        href={`/uploads/${element.status.name}`} target='_blank'>{element.status.name}</Link>
                }
            </td>
            <td>
                <Group>
                    <ActionIcon variant="light"
                            size={'lg'}
                            color="gray"
                            onClick={() => setOpenAssociation(element) }
                            ><BsFillGearFill /></ActionIcon>
                </Group>
            </td>
        </tr>
    ))
    
    const acceptAssociation = (id) => {
        setLoading(true)
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
            .catch((error) => { 
                Toast.error('Erreur') 
                setLoading(false)
            })
        setOpenAssociation(null)
    }

    const declineAssociation = (id) => {
        setLoading(true)
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
            .catch((error) => { 
                Toast.error('Erreur') 
                setLoading(false)
            })
        setOpenAssociation(null)
    }

    const deleteAssociation = (id) => {
        setLoading(true)
        fetch(`/api/admin/association/delete`, {
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
            .catch((error) => { 
                Toast.error('Erreur') 
                setLoading(false)
            })
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
            <ScrollArea className="tw-max-w-[100%]">
                <Table striped withColumnBorders>
                    <thead>{ths}</thead>
                    <tbody>{rows}</tbody>
                </Table>
            </ScrollArea>
            </Tabs.Panel>

            
            <Modal
                opened={openAssociation}
                onClose={() => setOpenAssociation(null)}
                title={<Title order={6}>Association {openAssociation?.name}</Title>}
                centered
                size={'95vw'}
            >
                <form className="tw-p-4">
                    <Text weight={600}>Actions</Text>
                    <Group mt={'sm'}>
                        <Button variant="outline" color="pink" disabled={loading}
                            size={'xs'}
                            leftIcon={<ImCross size={12} />}
                            onClick={() => declineAssociation(openAssociation?.id) }>Refuser</Button>
                        <Button variant="outline" disabled={loading}
                            size={'xs'}
                            color="teal"
                            leftIcon={<BsCheckLg size={12} />}
                            onClick={() => acceptAssociation(openAssociation?.id) }>Accepter</Button>
                        <Divider size="md" orientation="vertical" />
                        <Button variant="outline" color="red" disabled={loading}
                            size={'xs'}
                            leftIcon={<BsTrash size={12} />}
                            onClick={() => deleteAssociation(openAssociation?.id) }>Supprimer</Button>
                    </Group>
                    <Text weight={600} mt={'md'}>Informations</Text>
                    <Box className="tw-rounded-2xl tw-shadow-lg tw-bg-white tw-py-7 tw-px-6" >
                        <Title order={2} weight={600} align="left">{openAssociation?.name}</Title>
                        <Information label={'Bio'} value={openAssociation?.address}/>
                        <Information label={'Adresse'} value={openAssociation?.address}/>
                        <Information label={'Adresse'} value={openAssociation?.address}/>
                        <Information label={'Téléphone'} value={openAssociation?.phone}/>
                        <Information label={'Email'} value={openAssociation?.email}/>
                    </Box>
                </form>
            </Modal>
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