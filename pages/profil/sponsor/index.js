import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { ActionIcon, Avatar, Badge, Box, Button, Card, Center, FileButton, Flex, Grid, Group, Modal, SegmentedControl, Select, Space, Stack, Text, Textarea, Title } from '@mantine/core'
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
import { getCookie } from 'cookies-next'
import { serialize } from 'object-to-formdata'
import { useRouter } from 'next/router'
import { AiOutlineFileText, AiOutlineUpload } from 'react-icons/ai'
import { RxCheck, RxCross2 } from 'react-icons/rx'
import fileUploader from '@/utils/fileUploader'


const CardsSection = (props) => (
        <section className='tw-mt-8'>
            <Title align={"center"} order={6}
                className="tw-uppercase tw-mb-3">
                    {props.title}</Title>
                    {props.children}
        </section>
)

const Status = ({offer}) => {
  const [contrat, setContrat] = useState(null)
  const [edit, setEdit] = useState(null)
  const status = offer.status
  const uploadHandler = (file) => {
    setContrat(file)
    setEdit(true)
  }
  const upload = () => {
    fileUploader(contrat)
    .then((response) => {
        let body = new FormData();
        body.append('filename', response.data.filename)
        body.append('offer', offer.id)
        fetch(`/api/sponsoring-offer/contrat`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: body
          })
          .then(res => res.json())
            .then(res => {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                setEdit(false)
            })
            .catch((error) => { 
              Toast.error('Erreur pendant le téléchargement du contrat') 
              cancel()
            })
    });
  }
  const cancel = () => {
    setContrat(null)
    setEdit(false)
  }

  if (offer.contrat == null) {
    return (
      <Flex direction={'column'}>
        <Badge className='tw-font-semibold tw-shadow-sm tw-underline tw-text-blue-500 tw-flex tw-flex-row' size={'sm'} color={'yellow'}>
          <Group>En attente de signature contrat <AiOutlineFileText /></Group>
        </Badge>
        <Stack align="flex-end" mt='sm'>
          <FileButton onChange={uploadHandler} accept=""
            className=''>
           {(props) => <Group {...props} className='tw-float-right tw-text-xs tw-underline tw-px-1 hover:tw-cursor-pointer
              tw-text-blue-500 tw-border-[1px] tw-border-blue-200 tw-shadow-sm tw-rounded-xl'>
                {contrat ? contrat.name : 'Déposer'}
                {contrat == null && <AiOutlineUpload />}</Group>}
          </FileButton>
          {edit &&
            <Group position="right">
              <ActionIcon onClick={cancel} className='tw-bg-gray-200/50' 
                    color='dark' variant='light' radius={'xl'}><RxCross2 /></ActionIcon>
              <ActionIcon onClick={upload} className='tw-bg-teal-300/50' 
                    color='teal' variant='light' radius={'xl'}><RxCheck /></ActionIcon>
            </Group>
          }
        </Stack>
      </Flex>
    )
  }

  return (
    <Badge className='tw-font-semibold tw-shadow-sm' size={'sm'} color={status == 0 ? 'yellow' : 'teal'}>
      {status == 0 ? 'En attente' : 'Validé'}</Badge>
  )
}

export default function Page(props) {
  const router = useRouter()
  const { asPath } = useRouter()
  const [loading, setLoading] = useState(false)
  const [sponsorOffers, setSponsorOffers] = useState(props.offers);
  const [opened, setOpened] = useState(false);
  const [tab, setTab] = useState('Nationale')
  const tabHandler = (state) => {
    if (state == 'Nationale')
      form.setValues({association: null})
      setTab(state)
  }

  const form = useForm({
      initialValues: {
          association: '',
          description: '',
      },
      validate: {
        association: (value) => {
          if (tab == 'Nationale') {
            return null
          } else {
            if (value != '' && value != null) {
              return null 
            } else {
              return 'Veuillez saisir une association'
            }
          }
        },
        description: (value) => (value != '' ? null : 'Veuillez saisir une description'),
      },
  });

    
  const submitHandler = (values) => {
      setLoading(true)
      let body = serialize(values)
      fetch(`/api/sponsoring-offer`, {
          method: 'POST',
          headers: new Headers({
            'JWTAuthorization': `Bearer ${getCookie('token')}`
          }),
          body: body
        }).then(res => res.json())
          .then(res => {
              if(res.data) {
                      Toast.success('Offre envoyée')
                  }
                  setLoading(false)
                  setOpened(false)
                  form.reset()
                  router.replace(router.pathname)
              })
          .catch((error) => { 
            console.log('error', error)
            Toast.error('Erreur pendant l\'enregistrement de l\'offre') 
            setLoading(false)
            setOpened(false)
      })
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
      <AssociationCarte href={`./sponsor/association/${card.id}`} organisation={card} />
    </Grid.Col>
  )

  const associationsGrid = props.associations?.length == 0
    ? <Text fz={'sm'} align="center" color="dimmed">Aucune association enregistrée</Text>
    : <Grid gutter={12} className="mt-4 tw-px-3">{associations}</Grid>

    
  const OfferRow = ({offer}) => (
    <Card className='tw-flex tw-bg-gray-50 tw-mb-2' radius={'lg'}>
      <Center>
        <Avatar className='tw-shadow-md' radius={'lg'} src={offer.association?.avatar?.name} />
      </Center>
      <Flex direction={'column'} className='tw-flex-1 tw-px-5'>
        <Flex justify={'space-between'}>
          <Text fz={'sm'} weight={550}>{offer.association?.description}</Text>
        </Flex>
        <Text color='dimmed'>{offer.description}</Text>
      </Flex>
      <Center>
        <Status offer={offer} />
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
                  {sponsorOffers.length == 0
                    ? <Text color='dimmed' size={'sm'} align='center'>Aucune offre</Text>
                    : offersList}
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

              <form className='tw-p-4' onSubmit={form.onSubmit((values) => submitHandler(values))}>
                
                <SegmentedControl
                  styles={{
                    root: { 
                    }
                  }}
                  fullWidth 
                  value={tab}
                  onChange={tabHandler}
                  radius="xl"
                  size="md"
                  data={['Nationale', 'Locale']}
                  color="gray"
                  className='tw-border-[1px] tw-border-b-0 tw-border-white tw-mb-4'
                />

                {tab == 'Locale' &&
                <Select
                    label="Association à soutenir"
                    placeholder="Choisir"
                    itemComponent={SelectItem}
                    data={associationsSelect}
                    maxDropdownHeight={400}
                    mb={'md'}
                    onDropdownClose={() => console.log('closing')}
                    {...form.getInputProps('association')}/>
                }

                <Textarea size="xs" mb={'sm'} label="Description de l'offre"
                      minRows={3}
                      autosize
                      withAsterisk
                      {...form.getInputProps('description')}/>

                <Center>
                  <Button className='tw-bg-lime-600 hover:tw-bg-teal-600'
                          radius={'lg'} size="sm" variant="filled"
                          type='submit'
                          disabled={loading}>
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

  let offers = await getOffers(token)
  console.log('offers', offers)

  // // Pass data to the page via props
  return { props: { 
    backgroundImage: backgroundImage.filename,
    cards: JSON.parse(data.data),
    avatar: avatar.filename,
    associations: JSON.parse(associations.data),
    offers: JSON.parse(offers.data)
  } }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}