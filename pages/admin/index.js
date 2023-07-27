import { ActionIcon, Box, Table, Tabs, Title } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getUser } from "@/domain/repository/UserRepository";

export default function Page(props){
    const elements = [
        { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
        { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
        { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
        { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
        { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    ]
    
    const ths = (
        <tr>
          <th>Element position</th>
          <th>Element name</th>
          <th>Symbol</th>
          <th>Atomic mass</th>
        </tr>
    )
    
    const rows = elements.map((element) => (
        <tr key={element.name}>
            <td>{element.position}</td>
            <td>{element.name}</td>
            <td>{element.symbol}</td>
            <td>{element.mass}</td>
        </tr>
    ))
    
    return (
        <>
            <Table striped withColumnBorders>
                <thead>{ths}</thead>
                <tbody>{rows}</tbody>
            </Table>
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
    }else {
        return {
            redirect: {
            permanent: false,
            destination: "/admin/offres"
            }
        }
    }
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }