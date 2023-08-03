import { ActionIcon, Box, Center, CopyButton, Flex, Group, Modal, ScrollArea, Space, Stack, Table, Tabs, Text, TextInput, Title, Tooltip } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getUser, getUsers } from "@/domain/repository/UserRepository";
import UserRoleBadge from "@/components/UserRoleBadge";
import { TbCopy, TbCheck } from "react-icons/tb"
import { useState } from "react";
import { RxInfoCircled } from "react-icons/rx";

export default function Page(props){
    const [open, setOpen] = useState(false)
    const [openUser, setOpenUser] = useState(null)
    const users = props.users

    const modalHandler = (user) => {
        if (user == false) {
            setOpenUser(null)
            setOpen(false)
            return
        }
        setOpenUser(user)
        setOpen(true)
    }
    const ths = (
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Role</th>
          <th></th>
        </tr>
    )
    
    const rows = users.map((user) => (
        <tr key={user.id}>
            <td><Text transform="capitalize">{user.nom}&nbsp;{user.prenom}</Text></td>
            <td>
                <Flex>
                    <Text>{user.email}</Text>
                    <CopyButton value={user.email} timeout={1500}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copié' : 'Copier'} withArrow position="right">
                            <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                {copied ? <TbCheck size={14} /> : <TbCopy size={14} />}
                            </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                </Flex>
            </td>
            <td><UserRoleBadge roles={user.roles} /></td>
            <td>
                <Center><ActionIcon onClick={() => modalHandler(user)}>
                    <RxInfoCircled /></ActionIcon></Center>
            </td>
        </tr>
    ))
    
    return (
        <>
            <ScrollArea className="tw-max-w-[100%]">
                <Tabs.Panel value="utilisateurs" p={"md"}>
                    <Title order={6} align="left">Utilisateurs</Title>
                    <Table  fontSize={'sm'} striped withColumnBorders>
                        <thead>{ths}</thead>
                        <tbody>{rows}</tbody>
                    </Table>
                </Tabs.Panel>
            </ScrollArea>
            
            <Modal
                opened={open}
                onClose={() => modalHandler(false)}
                title={<Title order={6}>Informations</Title>}
                centered
                size={'60vw'}
            >
                <TextInput readOnly description="Nom" value={openUser?.nom}/>
                <Space h={'md'} />
                <TextInput readOnly description="Prénom" value={openUser?.prenom}/>
                <Space h={'md'} />
                <TextInput readOnly description="Téléphone" value={openUser?.telephone}/>
                <Space h={'md'} />
                <TextInput readOnly description="Email" value={openUser?.email}
                    rightSection={
                        <CopyButton value={openUser?.email} timeout={1500}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? 'Copié' : 'Copier'} withArrow position="right">
                                <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                    {copied ? <TbCheck size={14} /> : <TbCopy size={14} />}
                                </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>}/>
                <Space h={'md'} />
                <Stack align="flex-start" spacing="xs">
                    <Text fz={'xs'} color="dimmed">Role</Text>
                    <UserRoleBadge roles={openUser?.roles} />
                </Stack>
            </Modal>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
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
    let users = await getUsers(token)
    console.log('users', users)


    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        users: JSON.parse(users.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }