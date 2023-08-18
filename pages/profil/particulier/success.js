import { AspectRatio, BackgroundImage, Box, Center, Container, Image, Text, Title } from "@mantine/core"
import Layout from "./layout"
import moment from "moment"
import Link from "next/link"
import Head from "next/head"

export default function Page(props) {
    return (
      <>
        <Head><title>Pace&lsquo;sport - Confirmation d&lsquo;achat</title></Head>
        <Container className="">
          <Box className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-relative -tw-top-8 tw-z-0" p={'xl'}>
            <Title order={3} align="center">Votre achat à bien été enregistré</Title>
            <Center mt={'md'}>
              <Link className="tw-border-[1px] tw-px-8 tw-py-0.5 tw-border-[#d61515] tw-rounded-xl tw-shadow-md hover:tw-bg-gray-100" 
                href={props.prev}>Retour</Link>
            </Center>

          </Box>
        </Container>
      </>
    )
}

export async function getServerSideProps(context) {
    console.log('context', context.query.prev)
    // // Pass data to the page via props
    return { props: { 
        prev: context.query.prev
    } }
  }
  
Page.getLayout = function getLayout(page) {
return (
    <Layout image={false}>{page}</Layout>
)
}