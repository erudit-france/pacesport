import { AspectRatio, Avatar, BackgroundImage, Box, Center, Container, Group, Image, Space, Text, Title } from "@mantine/core"
import CampagneCard from "../../association/components/CampagneCard"
import Layout from "../layout"
import moment from "moment"
import Link from "next/link"
import Head from "next/head"

export default function Page(props) {
  console.log('props.acceptedOffers', props.acceptedOffers)
  const PurchaseLink = () => {
    if (props.isOwned == true) {
      return (
        <Text className="tw-border-[1px] tw-px-8 tw-py-0.5 tw-border-green-500 tw-bg-green-400 tw-text-gray-50 tw-rounded-xl tw-shadow-md">Possédée</Text>
      )
    } else {
      return (
        <Link className="tw-border-[1px] tw-px-8 tw-py-0.5 tw-border-[#d61515] tw-rounded-xl tw-shadow-md hover:tw-bg-gray-100" 
        href={props.cardPurchaseLink}>Souscrire</Link>
      )
    }
  }

    const standaloneCard = <>
      <Center>
        <Box className="tw-rounded-xl tw-shadow-lg tw-relative">
            <Image
                className="tw-absolute tw-rounded-xl tw-right-1 tw-opacity-80 -tw-translate-y-1/2 tw-top-1/2"
                width={36}
                height={36}
                src={offer.enseigne.avatar?.name}
                alt="logo sim"
            />
            <Image
              className="tw-opacity-95 tw-rounded-xl"
              radius={'lg'}
              width={260}
              height={160}
              src={`/uploads/${props.card.image?.name}`}
              alt="Photo de campagne"
            />
        </Box>
      </Center>
    </>

    const AcceptedOffers = props.acceptedOffers.map((offer) => (
        <Box key={offer.id} className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-relative tw-z-0 tw-mb-3" p={'md'}>
          <Group>
            <Avatar className="tw-shadow-md" radius='xl' src={`/uploads/${offer.enseigne.avatar?.name}`} />
            <Title order={6}>{offer.enseigne.name}</Title>
          </Group>
          <Text fz={'sm'} p={'sm'}>
            {offer.description}
          </Text>
        </Box>
    ))

    return (
      <>
        <Head><title>Pace&lsquo;sport - Détails campagne {props.card.name}</title></Head>
        <Container className="">
          <Box className="tw-relative tw-z-[1]">
            {standaloneCard}
          </Box>
          <Box className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-pt-12 tw-relative -tw-top-8 tw-z-0" p={'xl'}>
            <Title order={2} mb={'sm'} align="center">{props.card.name}</Title>
            <Text className="tw-text-gray-800" align="center" fz={'sm'}>Valable du {moment(props.card.startDate).format('DD/MM/YYYY')} au {moment(props.card.endDate).format('DD/MM/YYYY')}</Text>
            <Title order={5} align="center" className="tw-text-gray-700">{props.card.price.toFixed(2)} €</Title>
            <Center mt={'md'}>
              <PurchaseLink />
            </Center>
          </Box>
        </Container>

        <Space h={'md'} />
        {props.acceptedOffers.length > 0 &&
          <Box px={'md'}>
            {AcceptedOffers}
          </Box>
          }
      </>
    )
}

export async function getServerSideProps(context) {
    const id = context.query.id
    const token = context.req.cookies['token']
    const res = await fetch(`${process.env.API_URL}/api/discount-card/${id}/`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
      )
    const card = await res.json()

    let stripe = await fetch(`${process.env.API_URL}/api/stripe/dicsountcard`, {
        method: 'POST',
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        }),
        body: JSON.stringify({
            cancelUrl: `${process.env.NEXT_URL}${context.resolvedUrl}`,
            baseUrl: `${process.env.NEXT_URL}`,
            discountCardId: id
        })
    })
    stripe = await stripe.json();
    
    const isOwnedData = await fetch(`${process.env.API_URL}/api/discount-card/is-owned/${id}`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
      )
    const isOwned = await isOwnedData.json()
    // // Pass data to the page via props
    return { props: { 
      card: JSON.parse(card.data),
      acceptedOffers: JSON.parse(card.offersData),
      cardPurchaseLink: stripe.discountCardUrl,
      isOwned: isOwned.data.isOwned
    } }
  }
  
Page.getLayout = function getLayout(page) {
return (
    <Layout image={false}>{page}</Layout>
)
}