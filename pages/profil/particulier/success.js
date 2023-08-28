import { AspectRatio, BackgroundImage, Box, Center, Container, Image, Text, Title,Button} from "@mantine/core"; 
import { BsArrowLeft } from "react-icons/bs";
import Layout from "./layout"
import moment from "moment"
import Link from "next/link"
import Head from "next/head"

export default function Page(props) {
    return (
      <>
        <Head><title>Pace'sport - Confirmation d'achat</title></Head>
        <Container className="">
          <Box className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-relative -tw-top-8 tw-z-0" p={'xl'}>
            <Title order={3} align="center">Votre achat à bien été enregistré</Title>
            <Center mt={'md'}>
            <Button variant="filled" id="goBackButton" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button>
            </Center>

          </Box>
        </Container>
        <script dangerouslySetInnerHTML={{ __html: `
            // Attacher un gestionnaire d'événements au bouton
            document.getElementById('goBackButton').addEventListener('click', function() {
                // Appeler la fonction pour revenir en arrière dans l'historique
                window.history.back();
            });
        `}} />
      </>
    )
}

export async function getServerSideProps(context) {
    // // Pass data to the page via props
    return { props: { 
    } }
  }
  
Page.getLayout = function getLayout(page) {
return (
    <Layout image={false}>{page}</Layout>
)
}