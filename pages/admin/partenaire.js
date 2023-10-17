import { ActionIcon, Box, Center, CopyButton, Flex, Group, Modal, ScrollArea, Space, Stack, Table, Tabs, Text, TextInput, Title, Tooltip } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { getAllEnseignes } from "@/domain/repository/AdminRepository";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getUser, getUsers } from "@/domain/repository/UserRepository";
import UserRoleBadge from "@/components/UserRoleBadge";
import { TbCopy, TbCheck } from "react-icons/tb"
import { useState } from "react";
import { RxInfoCircled } from "react-icons/rx";
import { FiTrash2 } from "react-icons/fi";
import { getCookie } from 'cookies-next'
import Toast from "@/services/Toast";

export default function Page(props) {
  const [partenaires, setPartenaires] = useState(Array.isArray(props.partenaires) ? props.partenaires : []);




  const ths = (
    <tr>
      <th>Nom</th>
      <th>Email</th>
      <th>Role</th>
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
      <td><UserRoleBadge roles={partenaire.address} /></td>
      <td>

      </td>
      <td>

      </td>
    </tr>
  ))

  return (
    <>
      <ScrollArea className="tw-max-w-[100%]">
        <Tabs.Panel value="Partenaires" p={"md"}>
          <Title order={6} align="left">Partenaires</Title>
          <Table fontSize={'sm'} striped withColumnBorders>
            <thead>{ths}</thead>
            <tbody>{rows}</tbody>
          </Table>
        </Tabs.Panel>
      </ScrollArea>
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
  let partenaires = await getAllEnseignes(token)
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