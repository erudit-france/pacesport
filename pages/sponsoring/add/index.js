import Head from "next/head"
import Layout from "../layout"

export default function Page() {
    return (
        <>
            <Head><title>Sponsoring - Ajouter</title></Head>

        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}