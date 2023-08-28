import Head from "next/head"
import Layout from "../layout"
import { Box, Container, Flex, Grid, Group, Space, Text, Title } from "@mantine/core"
import AssociationCardParticulier from "@/components/AssociationCardParticulier"

export default function Page(props) {
    const Information = ({label, value}) => (
        <Flex className="tw-text-sm tw-mt-1">
            <Text>{label}:</Text>
            <Text ml={'lg'} weight={400}>{value}</Text>
        </Flex>
    )

    const OfferCards = () => (
        props.cards.length == 0
            ? <Text fz={'sm'} align="center" color="dimmed">Aucune association enregistrée</Text>
            : <Grid gutter={12} className="mt-4 tw-px-3">
                {props.cards.map(function(card) {
                return (
                    <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
                        <AssociationCardParticulier card={card} />
                    </Grid.Col>
                    )})}
            </Grid>
    )

    const association = props.association
    const associationInformation = <Box className="tw-rounded-2xl tw-shadow-lg tw-bg-white tw-py-7 tw-px-6" >
        <Title order={2} weight={600} align="center">{association.name}</Title>
        <Text align="center" fz={'sm'}>{association.description}</Text>
        <Information label={'Adresse'} value={association.address}/>
        <Information label={'Téléphone'} value={association.phone}/>
        <Information label={'Email'} value={association.email}/>
    </Box>

    return (
        <>
            <Head><title>Pace'Sport - {association.name}</title></Head>
            <Container>{associationInformation}</Container>
            <Space h={'xl'} />
            <Title order={3} transform="uppercase" align="center" 
                className="tw-text-gray-100" mb={'md'}
                style={{textShadow: '#000 1px 0px 8px'}}
                >Cartes</Title>
            <OfferCards/>
        </>
    )
}


export async function getServerSideProps(context) {
    const id = context.query.id
    const token = context.req.cookies['token']
    const res = await fetch(`${process.env.API_URL}/api/association/get/${id}`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
      )
    const data = await res.json()
    
    let cards = await fetch(`${process.env.API_URL}/api/discount-card`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
        )
    cards = await cards.json()

    // // Pass data to the page via props
    return { props: { 
      association: JSON.parse(data.data),
      cards: JSON.parse(cards.data)
    } }
  }
  
Page.getLayout = function getLayout(page) {
return (
    <Layout image={false}>{page}</Layout>
)
}