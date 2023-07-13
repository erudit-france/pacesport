import { ActionIcon, Box, Flex, Select, Table, Tabs, Title } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";

export default function Page(props){
    const elements = [
    ]
    
    const ths = (
        <tr>
          <th>Compte</th>
          <th>Type</th>
          <th>Status</th>
        </tr>
    )
    
    const rows = elements.map((element) => (
        <tr key={element.name}>
            <td>{element.position}</td>
            <td>{element.name}</td>
        </tr>
    ))
    
    return (
        <>
            <Tabs.Panel value="comptes-pro" p={"md"}>
            <Flex justify={'space-between'} py={"sm"}>
                <Title order={4} align="center">Comptes pro</Title>
                <Select
                    styles={ {
                        root: { display: 'flex', flexDirection: 'row' },
                        label: { display: 'flex', alignSelf: 'center', marginRight: '5px' }
                    }}
                    data={[
                        { value: 'all', label: 'Tout' },
                        { value: 'enseigne', label: 'Sponsors' },
                        { value: 'association', label: 'Associations' }
                    ]}
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

    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        currentTab: 'hello'
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }