import Head from "next/head"
import Layout from "./layout"
import { Box, Button, Center, Container, Flex, Grid, Group, Modal, Select, Space, Text, TextInput, Textarea, Title } from "@mantine/core"
import AssociationCard from "@/components/AssociationCard"
import { useForm } from "@mantine/form";
import { useState } from "react";
import Toast from "@/services/Toast";

export default function Page(props) {
    const association = props.association
    const [opened, setOpened] = useState(false);
    const categoriesOffre = [
        { value: 'Alimentaire', label: 'Alimentaire' },
        { value: 'Vêtements', label: 'Vêtements' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Electronique', label: 'Electronique' },
    ]
    const form = useForm({
        initialValues: {
            association: association.id,
            categorie: '',
            description: '',
        },
        validate: {
          categorie: (value) => (value != '' ? null : 'Veuillez saisir une catégorie'),
          description: (value) => (value != '' ? null : 'Veuillez saisir une description'),
        },
    });

    const submitHandler = (values) => {
        console.log('values', values)
        setOpened(false)
        form.reset()
        Toast.success('Offre envoyée')
    }

    const Information = ({label, value}) => (
        <Flex className="tw-text-sm tw-mt-1">
            <Text>{label}:</Text>
            <Text ml={'lg'} weight={400}>{value}</Text>
        </Flex>
    )

    const associationInformation = <Box className="tw-rounded-2xl tw-shadow-lg tw-bg-white tw-py-7 tw-px-6" >
        <Title order={2} weight={600} align="center">{association.name}</Title>
        <Text align="center" fz={'sm'}>{association.description}</Text>
        <Information label={'Adresse'} value={association.address}/>
        <Information label={'Téléphone'} value={association.phone}/>
        <Information label={'Email'} value={association.email}/>
    </Box>

    return (
        <>
            <Head><title>Pace&lsquo;Sport - {association.name}</title></Head>
            <Container>{associationInformation}</Container>
            <Space h={'xl'} />
            <Container>
                <Center mb={'md'}>
                    <Button size='md'
                        onClick={() => setOpened(true)}
                        className='tw-text-black
                                    tw-px-8 tw-py-3 
                                    tw-bg-gradient-to-br tw-from-gray-200 tw-to-white
                                    tw-shadow-md tw-w-full tw-rounded-2xl
                                    tw-border-2 tw-border-white
                                    hover:tw-to-gray-200'>Soutenir l&lsquo;association</Button>
                </Center>
                <Center>
                    <Button size='md'
                        className='tw-text-black
                                    tw-px-8 tw-py-3 
                                    tw-bg-gradient-to-br tw-from-gray-200 tw-to-white
                                    tw-shadow-md tw-w-full tw-rounded-2xl
                                    tw-border-2 tw-border-white
                                    hover:tw-to-gray-200'>Contacter</Button>
                </Center>
            </Container>
            
            <Modal
              radius={'lg'}
              centered
              opened={opened}
              onClose={() => setOpened(false)}
              title="Soutenir une association"
            >

              <form className='tw-p-4'onSubmit={form.onSubmit((values) => submitHandler(values))}>
                <TextInput
                    readOnly
                    placeholder={association.name}
                    label="Association"
                    mb={'md'}
                    />
                <Select
                      label="Catégorie de l'offre"
                      placeholder="Choisir"
                      data={categoriesOffre}
                      mb={'md'}
                      {...form.getInputProps('categorie')}/>

                <Textarea size="xs" mb={'sm'} label="Description de l'offre"
                      minRows={3}
                      autosize
                      withAsterisk
                      {...form.getInputProps('description')}/>

                <Center>
                  <Button className='tw-bg-lime-600 hover:tw-bg-teal-600'
                          radius={'lg'} size="sm" variant="filled"
                          type='submit'>
                    Envoyer mon offre</Button>
                </Center>
              </form>
            </Modal>
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
    <Layout>{page}</Layout>
)
}