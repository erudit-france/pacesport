import Head from "next/head"
import Layout from "../layout"
import { Button, Flex, Paper, Select } from "@mantine/core"
import { FaChevronDown } from 'react-icons/fa'
import { useState } from "react";
import MaillotForm from "./components/MaillotForm";
import PanneauForm from "./components/PanneauForm";

export default function Page() {
    const [category, setCategory] = useState(null);

    return (
        <>
            <Head><title>Sponsoring - Ajouter</title></Head>
            <div className="container mx-auto tw-px-4">
                <PanneauForm/>
            </div>
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout text="Partenariat" subtext={"Ajouter"}>{page}</Layout>
    )
}