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
            <div className="container mx-auto tw-px-2">
                <Select
                    className="tw-border-gray-700 tw-border-0 tw-rounded-3xl tw-mb-5"
                    radius={'lg'}
                    label="Choisir une catégorie"
                    placeholder="Catégorie"
                    rightSection={<FaChevronDown size={14} />}
                    rightSectionWidth={30}
                    styles={{ rightSection: { pointerEvents: 'none' } }}
                    value={category} onChange={setCategory}
                    data={[
                        { value: 'Maillot', label: 'Maillot' },
                        { value: 'Panneau', label: 'Panneau' }]}
                    withAsterisk/>
                {category == 'Maillot' && <MaillotForm/> }
                {category == 'Panneau' && <PanneauForm/> }
            </div>
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout text="Partenariat" subtext={"Ajouter"}>{page}</Layout>
    )
}