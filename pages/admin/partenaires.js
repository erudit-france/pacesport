import { ActionIcon, Box, Center, CopyButton, Flex, Group, Modal, ScrollArea, Space, Stack, Table, Tabs, Text, TextInput, Title, Tooltip } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers, FiTrash2 } from "react-icons/fi";
import { getAllEnseignes } from "@/domain/repository/AdminRepository";
import { getUser, getUsers } from "@/domain/repository/UserRepository";
import UserRoleBadge from "@/components/UserRoleBadge";
import { TbCopy, TbCheck } from "react-icons/tb"
import { useState } from "react";
import { RxInfoCircled } from "react-icons/rx";
import { getCookie } from 'cookies-next'
import Toast from "@/services/Toast";

export default function Page(props) {
  const [partenaires, setPartenaires] = useState(Array.isArray(props.partenaires) ? props.partenaires : []);
  const [open, setOpen] = useState(false);
  const [openPartenaire, setOpenPartenaire] = useState(null);

  const modalHandler = (partenaire) => {
    if (partenaire == false) {
      setOpenPartenaire(null)
      setOpen(false)
      return
    }
    setOpenPartenaire(partenaire)
    setOpen(true)
  }
  const deletePartenaire = (partenaireId) => {
    fetch(`/api/partenaire/delete/${partenaireId}`, {
      method: 'DELETE',
      headers: new Headers({
        'JWTAuthorization': `Bearer ${getCookie('token_v2')}`
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          Toast.success('Partenaire supprimé et e-mail envoyé avec succès');
          setPartenaires(partenaires.filter(partenaire => partenaire.id !== partenaireId));
        } else {
          Toast.error('Erreur lors de la suppression du partenaire');
        }
        console.log('res', res);
      })
      .catch(error => {
        Toast.error('Une erreur est survenue');
        console.error('Error:', error);
      });
  };
  const confirmDelete = (partenaireId) => {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?");
    if (confirmation) {
      deletePartenaire(partenaireId);
    }
  };
  const ths = (
    <tr>
      <th>Nom</th>
      <th>Email</th>
      <th>Adresse</th>
      <th>Supprimer</th>
      <th></th>
    </tr>
  )

  const rows = partenaires.map((partenaire) => (
    <tr key={partenaire.id}>
      <td><Text transform="capitalize">{partenaire.name}</Text></td>
      <td>
        <Flex>
          <Text>{partenaire.email}</Text>
          <CopyButton value={partenaire.email} timeout={1500}>
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
      <td><Text transform="capitalize">{partenaire.address}</Text></td>
      <td>
        <Center>
          <ActionIcon onClick={() => confirmDelete(partenaire.id)}>
            <FiTrash2 />
          </ActionIcon>
        </Center>
      </td>
      <td>
        <Center><ActionIcon onClick={() => modalHandler(partenaire)}>
          <RxInfoCircled /></ActionIcon></Center>
      </td>
    </tr>
  ))

  return (
    <>
      <ScrollArea className="tw-max-w-[100%]">
        <Tabs.Panel value="partenaires" p={"md"}>
          <Title order={6} align="left">Partenaires ({partenaires.length})</Title>

          <Table fontSize={'sm'} striped withColumnBorders>
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
        <TextInput readOnly description="Nom" value={openPartenaire?.name} />
        <Space h={'md'} />
        <TextInput readOnly description="Email" value={openPartenaire?.email}
          rightSection={
            <CopyButton value={openPartenaire?.email} timeout={1500}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copié' : 'Copier'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                    {copied ? <TbCheck size={14} /> : <TbCopy size={14} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>} />
        <Space h={'md'} />
        <TextInput readOnly description="Adresse" value={openPartenaire?.address} />
      </Modal>
    </>
  )
}

export async function getServerSideProps(context) {
  const token = context.req.cookies['token_v2']
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
  const response = await getAllEnseignes(token);
  let partenaires = JSON.parse(response.data);

  return {
    props: {
      partenaires: partenaires,
    }
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout avatar={null}>{page}</Layout>
  )
}