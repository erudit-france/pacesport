import Head from "next/head";
import Layout from "../layout";
import { Box, Button, Card, Container, Flex, Image, Popover, Space, Text, Title} from "@mantine/core"; 
import { BsArrowLeft } from "react-icons/bs";
;
import { getSponsorDiscountOffers } from "@/domain/repository/DiscountOfferRepository";
import moment from "moment";

export default function Page(props) {
    const {discountOffers} = props

    const OffersSection = () => (
        discountOffers.length == 0 
            ? <Text color="dimmed" fz={'sm'} align="center">Aucune offre en cours</Text>
            : discountOffers.map((offer) => (
                <Card key={offer.id} className="tw-flex tw-flex-row tw-p-0" mb={'xs'} radius={'lg'} withBorder>
                    <Box className="tw-flex tw-justify-center tw-align-middle">
                        <Image
                            className="tw-my-auto tw-rounded-md"
                            src={`/uploads/${offer.avatar?.name}`}
                            width={80}
                            alt="Norway"
                            />
                    </Box>

                    <Box p={'sm'} className="tw-flex-1">
                        <Flex justify={'space-between'}>
                            <Text size="xs" color="">Association: {offer.enseigne.name}</Text>
                            <Text size="xs" color="dimmed">Début: {moment(offer.discountCard.startDate).format('DD/MM/YYYY')}</Text>
                        </Flex>
                        <Text size="xs" color="dimmed">Carte: {offer.description}</Text>
                        <Flex>
                            <Popover width={200} position="bottom" withArrow shadow="md">
                                <Popover.Target>
                                    <Button className="tw-bg-zinc-700" color="dark" fz={'sm'} size="xs">Détails offre</Button>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Text size="sm">{offer.description}</Text>
                                </Popover.Dropdown>
                            </Popover>
                        </Flex>
                    </Box>

                </Card>
            ))
    )

    return (
        <>
            <Head>
              <title>Mes partenariats - PACE'SPORT</title>
              <meta name="description" content="PACE'SPORT" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container pt={'md'} p={'xl'}>
                <Box my={'sm'}>
                <Button variant="filled" id="goBackButton" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-ml-5 tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button>
                    <Title order={4} align='center' transform='uppercase' my={"md"}>Mes partenariats</Title>
                    <Text color="dimmed" fz={'sm'} align="center">Aucun partenariat en cours</Text>
                    <Space h={'lg'} />
                    <Title order={4} align='center' transform='uppercase' my={"md"}>Mes offres</Title>
                    <Container>
                        <OffersSection/>
                    </Container>
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
    const token = context.req.cookies['token']
    let url = context.req.headers.referer
    let previousUrl = url === undefined ? '/profil/sponsor/' : url
    let backgroundImage = await fetch(`${process.env.API_URL}/api/sponsor/background`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
    )
    backgroundImage = await backgroundImage.json();

    // fetch avatar
    let avatar = await fetch(`${process.env.API_URL}/api/enseigne/avatar`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    avatar = await avatar.json();
  
    let offers = await getSponsorDiscountOffers(token);

    // // Pass data to the page via props
    return { props: { 
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        discountOffers: JSON.parse(offers.data.offers)
    } }
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }