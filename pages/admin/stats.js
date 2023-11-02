import { ActionIcon, Avatar, Badge, Box, Button, Center, CopyButton, Divider, FileInput, Flex, Group, Image, Modal, ScrollArea, Space, Stack, Table, Tabs, Text, TextInput, Title, Tooltip } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getUser, getUsers } from "@/domain/repository/UserRepository";
import UserRoleBadge from "@/components/UserRoleBadge";
import { TbCopy, TbCheck } from "react-icons/tb"
import { getAllActiveSubscription } from '@/domain/repository/OrderRepository'
import { useState } from "react";
import { RxInfoCircled } from "react-icons/rx";
import { getPacesportCard } from "@/domain/repository/PacesportRepository";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import moment from "moment/moment";
import { BsCheckLg, BsFillGearFill, BsTrash } from "react-icons/bs";
import { getAll } from "@/domain/repository/RapatriementRepository";
import { ImCross } from "react-icons/im";

export default function Page(props) {
    const [loading, setLoading] = useState(false)
    const [openRapatriement, setOpenRapatriement] = useState(false)
    const pacesportSubscription = props.pacesportSubscription
    const [rapatriement, setRapatriement] = useState(null)
    const router = useRouter()
    const refresh = () => {
        router.reload(window.location.pathname)
    }
    const rapatriementHandler = (rapatriement) => {
        if (rapatriement) {
            setRapatriement(rapatriement)
            setOpenRapatriement(true)
            return
        }
        setRapatriement(null)
        setOpenRapatriement(false)
    }

    const acceptRapatriement = (id) => {
        setLoading(true)
        fetch(`/api/rapatriement/admin/accept`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
            }),
            body: JSON.stringify({ rapatriement: id })
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
        rapatriementHandler(null)
    }

    const declineRapatriement = (id) => {
        setLoading(true)
        fetch(`/api/rapatriement/admin/decline`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
            }),
            body: JSON.stringify({ rapatriement: id })
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
        rapatriementHandler(null)
    }

    const ths = (
        <tr>
            <th>Association</th>
            <th>Nb de cartés</th>
        </tr>
    )
    console.log("dd")
console.log(pacesportSubscription)

const groupedData = pacesportSubscription.reduce((result, item) => {
    const associationName = item.association.name;
    if (!result[associationName]) {
        result[associationName] = [];
    }
    result[associationName].push(item);
    return result;
}, {});

// Triez les groupes par "association.name" et "association.createAt"
const sortedGroups = Object.entries(groupedData).sort((a, b) => {
    const nameA = a[0];
    const nameB = b[0];
    const createAtA = a[1][0].association.createdAt;
    const createAtB = b[1][0].association.createdAt;

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    if (createAtA < createAtB) return -1;
    if (createAtA > createAtB) return 1;
    return 0;
});

// Créez un nouvel tableau trié avec le compte d'éléments dans chaque groupe
const result = sortedGroups.map(([name, items]) => ({
    association: name,
    createAt: items[0].association,
    count: items.length,
}));
  console.log(result)
    const rows = result.map((r) => (
        <tr key={r.id}>
            <td>
                <Group>
                    <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'} src={`/uploads/${r.createAt?.avatar?.name}`} />
                    <Text fz={'sm'}>{r.createAt?.name}</Text>
                </Group>
            </td>
            <td>
                <Group>
                    <Text fz={'sm'}>{r.count}</Text>
                </Group>
            </td>
        </tr>
    ))

    return (
        <>
            <ScrollArea className="tw-max-w-[100%]">
                <Tabs.Panel value="stats" p={"md"}>
                    <Title order={6}>Stats</Title>
                    <Table mt={'lg'} striped withColumnBorders fontSize={'sm'}>
                        <thead>{ths}</thead>
                        <tbody>{rows}</tbody>
                    </Table>

                </Tabs.Panel>
            </ScrollArea>
            <Modal
                opened={openRapatriement}
                onClose={() => rapatriementHandler(null)}
                title={<Title order={6}>Détails demande rapatriement</Title>}
                centered
                size={'60vw'}
            >
                <Group mb={'sm'}>
                    <Text weight={600} fz={'sm'}>Association</Text>
                    <Group>
                        <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'} src={`/uploads/${rapatriement?.association?.avatar?.name}`} />
                        <Text fz={'sm'}>{rapatriement?.association?.name}</Text>
                    </Group>
                </Group>
                <Group mb={'sm'}>
                    <Text weight={600} fz={'sm'}>Date création</Text>
                    <Text fz={'sm'}>{moment(rapatriement?.createdAt).format('DD/MM/YYYY')}</Text>
                </Group>

                <Text weight={600}>Transactions</Text>
                <Table mt={'lg'} striped withColumnBorders fontSize={'sm'}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>
                                <Text align="right">Valeur (€)</Text></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rapatriement?.orders.length > 0
                            && rapatriement.orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{moment(order.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className="tw-text-end">{(order.value * .85).toFixed(2)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <th>
                                <Text align="right">
                                    {(rapatriement?.orders.reduce((total, o) => o.value ? o.value + total : total, 0) * .85).toFixed(2)}
                                </Text>
                            </th>
                        </tr>
                    </tfoot>
                </Table>

                <Text weight={600} mt={'md'}>Actions</Text>
                <Group mt={'sm'}>
                    <Button variant="outline" color="pink" disabled={loading}
                        size={'xs'}
                        leftIcon={<ImCross size={12} />}
                        onClick={() => declineRapatriement(rapatriement?.id)}>Refuser</Button>
                    <Button variant="outline" disabled={loading}
                        size={'xs'}
                        color="teal"
                        leftIcon={<BsCheckLg size={12} />}
                        onClick={() => acceptRapatriement(rapatriement?.id)}>Accepter</Button>
                    {/* <Divider size="md" orientation="vertical" />
                    <Button variant="outline" color="red" disabled={loading}
                        size={'xs'}
                        leftIcon={<BsTrash size={12} />}
                        onClick={() => deleteAssociation(openAssociation?.id) }>Supprimer</Button> */}
                </Group>
            </Modal>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token_v3']
    let user = await getUser(token)
    if (user.code == 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }
    user = JSON.parse(user.data)
    if (!user.roles.includes('ROLE_ADMIN')) {
        return {
            redirect: {
                permanent: false,
                destination: "/login/as"
            }
        }
    }
    let avatar = await fetch(`${process.env.API_URL}/api/association/avatar`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
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
        })
    }
    )
    backgroundImage = await backgroundImage.json();

    let pacesportSubscription = await getAllActiveSubscription(token);
    pacesportSubscription = JSON.parse(pacesportSubscription.data)
    // // Pass data to the page via props
    return {
        props: {
            backgroundImage: backgroundImage.filename,
            avatar: avatar.filename,
            pacesportSubscription: pacesportSubscription
        }
    }
}

Page.getLayout = function getLayout(page) {
    return (
        <Layout avatar={null}>{page}</Layout>
    )
}