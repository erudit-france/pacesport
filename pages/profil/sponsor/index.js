import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { ActionIcon, Avatar, Box, Button, Card, Center, Flex, Grid, Group, Modal, Select, Space, Text, Textarea, Title } from '@mantine/core'
import AssociationCard from '@/components/AssociationCard'
import Layout from './layout'
import { IoMdSettings } from 'react-icons/io'
import { MdQrCode2 } from 'react-icons/md'
import { GoMegaphone } from 'react-icons/go'
import Link from 'next/link'
import OrganisationCard from '@/components/OrganisationCard'
import SponsoringOfferCard from '@/components/SponsoringOffer'
import AssociationCarte from '@/components/AssociationCarte'
import { forwardRef, useState } from 'react'
import { getOffers } from '@/domain/repository/CardOffersRepository'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useForm } from '@mantine/form'
import Toast from '@/services/Toast'

const CardsSection = (props) => (
        <section className='tw-mt-8'>
            <Title align={"center"} order={6}
                className="tw-uppercase tw-mb-3">
                    {props.title}</Title>
                    {props.children}
        </section>
)

export default function Page(props) {
  const [sponsorOffers, setSponsorOffers] = useState(props.offers);
  const [opened, setOpened] = useState(false);
  const categoriesOffre = [
    { value: 'Alimentaire', label: 'Alimentaire' },
    { value: 'Vêtements', label: 'Vêtements' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Electronique', label: 'Electronique' },
  ]

  const form = useForm({
      initialValues: {
          association: '',
          categorie: '',
          description: '',
      },
      validate: {
        association: (value) => (value != '' ? null : 'Veuillez saisir une association'),
        categorie: (value) => (value != '' ? null : 'Veuillez saisir une catégorie'),
        description: (value) => (value != '' ? null : 'Veuillez saisir une description'),
      },
  });

  const submitHandler = (values) => {
    console.log('values', values)
    let newOffer = {
      city: "Lyon2",
      description: "5% de réduction sur les articles ...",
      img: "https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png",
      title: "Auchan"
    }
    setSponsorOffers([...sponsorOffers, newOffer])
    setOpened(false)
    Toast.success('Offre envoyée')
  }

  // add label to existing array
  const associationsSelect = props.associations.map((a) => (
    {...a, label: a.description, value: a.id}
  ))

  const SelectItem = forwardRef(
    ({ avatar, description, ...others }, ref) => {
      return (
        <div ref={ref} {...others}>
          <Group noWrap>
            <Avatar radius={'xl'} src={avatar == null ? null : `/uploads/${avatar.name}`} />
            <div>
              <Text size="sm">{description}</Text>
            </div>
          </Group>
        </div>
      )
    }
  );
  SelectItem.displayName = 'SelectItem';

  const associations = props.associations.map((card) => 
    <Grid.Col key={String(card.id)} span={6} xs={6} xl={3}>
      <AssociationCarte organisation={card} />
    </Grid.Col>
  )

  const associationsGrid = props.associations?.length == 0
    ? <Text fz={'sm'} align="center" color="dimmed">Aucune association enregistrée</Text>
    : <Grid gutter={12} className="mt-4 tw-px-3">{associations}</Grid>

    
  const OfferRow = ({offer}) => (
    <Card className='tw-flex tw-bg-gray-50 tw-mb-2' radius={'lg'}>
      <Center>
        <Avatar className='tw-shadow-md' radius={'lg'} src={offer.img} />
      </Center>
      <Flex direction={'column'} className='tw-flex-1 tw-px-5'>
        <Flex justify={'space-between'}>
          <Text fz={'sm'} weight={550}>{offer.title}</Text>
        </Flex>
        <Text color='dimmed'>{offer.description}</Text>
      </Flex>
      <Center>
        <Text className='tw-font-semibold' fz={'sm'}>Status</Text>
      </Center>
    </Card>
  )

  const offersList = <>
    <section style={styles} className='tw-px-3'>
      {sponsorOffers.map((offer) => (
        <OfferRow key={offer.title} offer={offer} />
      ))}
    </section>
  </>

  return (
    <>
        <Head>
          <title>PACE&lsquo;SPORT</title>
          <meta name="description" content="PACE&lsquo;SPORT" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={ `${styles.main}` } >
            <main className='container tw-mt-6'>
              {/* search input */}
              {/* <section className='tw-relative -tw-top-4 tw-mx-6'>
                <SearchInput />
              </section> */}
              
              <Flex justify={'center'}>
                <Group position="center" className=''>
                    <Button size='md'
                        onClick={() => setOpened(true)}
                        className='tw-text-black
                                  tw-px-8 tw-py-3 
                                  tw-bg-gradient-to-br tw-from-gray-200 tw-to-white
                                  tw-shadow-md tw-w-full tw-rounded-2xl
                                  tw-border-2 tw-border-white
                                  hover:tw-to-gray-200'>Je soutiens une association</Button>
                  </Group>
              </Flex>

              <CardsSection title="Mes offres">
                  {offersList}
              </CardsSection>



              <CardsSection title="Associations près de vous">
                <Box className='tw-bg-gray-50/60 tw-shadow-inner tw-p-3'>
                    {associationsGrid}
                </Box>
              </CardsSection> 
            </main>
            <Space py={'xl'} />
            <Modal
              radius={'lg'}
              centered
              opened={opened}
              onClose={() => setOpened(false)}
              title="Soutenir une association"
            >

              <form className='tw-p-4'onSubmit={form.onSubmit((values) => submitHandler(values))}>
                <Select
                    label="Association à soutenir"
                    placeholder="Choisir"
                    itemComponent={SelectItem}
                    data={associationsSelect}
                    maxDropdownHeight={400}
                    mb={'md'}
                    onDropdownClose={() => console.log('closing')}
                    {...form.getInputProps('association')}/>

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
        </div>

    </>
  )
}

export async function getServerSideProps(context) {
  const token = context.req.cookies['token']
  const res = await fetch(`${process.env.API_URL}/api/discount-card`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
    )
  const data = await res.json()

  // fetch avatar
  let avatar = await fetch(`${process.env.API_URL}/api/enseigne/avatar`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  avatar = await avatar.json();

  // fetch Associations
  let associations = await fetch(`${process.env.API_URL}/api/association/list`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  associations = await associations.json();
  
  let backgroundImage = await fetch(`${process.env.API_URL}/api/sponsor/background`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  backgroundImage = await backgroundImage.json();

  let sponsoringOffers = await fetch(`${process.env.API_URL}/api/sponsoring-offer`, {
    headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
    })}
  )
  sponsoringOffers = await sponsoringOffers.json();

  let offers = await getOffers()

  // // Pass data to the page via props
  return { props: { 
    backgroundImage: backgroundImage.filename,
    cards: JSON.parse(data.data),
    avatar: avatar.filename,
    associations: JSON.parse(associations.data),
    sponsoringOffers: JSON.parse(sponsoringOffers.data),
    offers: offers.data
  } }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}