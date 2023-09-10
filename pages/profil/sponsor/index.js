import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchInput from '@/components/SearchInput'
import { ActionIcon, Avatar, Badge, Box, Button, Card, Center, FileButton, Flex, Grid, Group, Modal, MultiSelect, Popover, SegmentedControl, Select, Space, Stack, Text, TextInput, Textarea, Title } from '@mantine/core'
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
import { useDisclosure, useId } from '@mantine/hooks'
import SponsoringOfferTypeBadge from '@/components/SponsoringOfferTypeBadge'
import moment from 'moment/moment'
import { BsPlus } from 'react-icons/bs'

const CardsSection = (props) => (
  <section className='tw-mt-8'>
    <Title align={"center"} order={6}
      className="tw-uppercase tw-mb-3">
      {props.title}</Title>
    {props.children}
  </section>
)

const Status = ({ offer }) => {
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

  //   const showInfoAlert = () => {
  //     alert("Un contrat vous a été envoyé et doit être renvoyé par e-mail une fois rempli, signé et tamponné.");
  // };

  if (!(offer.validated == 1 && offer.status == 1 || offer.association == null && offer.validated == 1)) {
    return (
      <Flex direction={'column'}>
        {/* <button onClick={showInfoAlert} className='tw-bg-gray-200/50 tw-rounded-lg tw-py-2 tw-px-3 tw-text-dark tw-font-medium tw-hover:bg-gray-300'>
                            ?
                        </button> */}
        <Badge className='tw-font-semibold tw-shadow-sm tw-underline tw-text-blue-400/70 tw-flex tw-flex-row' size={'sm'} color={'yellow'}>
          <Text>En attente contrat</Text>
        </Badge>
        <Stack align="flex-end" mt='sm'>
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

    <Badge className='tw-font-semibold tw-shadow-sm' size={'sm'} color={offer.validated == 1 && offer.status == 1 ? 'teal' : 'yellow'}>
      {offer.validated == 1 && offer.status == 1 ? 'Validé' : 'En attente'}</Badge>
  )
}

export default function Page(props) {
  const router = useRouter()
  const { asPath } = useRouter()
  const [loading, setLoading] = useState(false)
  const [sponsorOffers, setSponsorOffers] = useState(props.offers);
  const [opened, setOpened] = useState(false);
  const [tab, setTab] = useState('Locale')
  const [maxSelectedAssociations, setMaxSelectedAssociations] = useState(99)
  const [selectedAssociations, setselectedAssociations] = useState([])
  const [editSelectedAssociations, setEditSelectedAssociations] = useState([])
  const [originalSelectedAssociations, setOriginalSelectedAssociations] = useState([])
  const [openOffer, setOpenOffer] = useState(null)

  const openOfferHandler = (offer) => {
    if (offer != null) {
      setOpenOffer(offer)
      // set association associations
      let associatedAssociations = offer.associations.map((a) => a.id)
      setEditSelectedAssociations(associatedAssociations)
      setOriginalSelectedAssociations(associatedAssociations)
      // set category
      if (offer.category) {
        offerForm.setFieldValue('category', offer.category.id)
      }

      offerForm.setValues({
        title: offer.title,
        description: offer.description,
      })
      return
    }
    setOpenOffer(null)
    setEditSelectedAssociations([])
    offerForm.reset()

  }

  const tabHandler = (state) => {
    if (state == 'Locale') {
      setMaxSelectedAssociations(99)
    } else {
      setselectedAssociations([])
      setMaxSelectedAssociations(1)
    }
    setTab(state)
    form.setValues({ type: (state == 'Globale' ? 'Nationale' : state) })
    console.log(form)
  }

  const form = useForm({
    initialValues: {
      association: [],
      description: '',
      type: 'Locale',
    },
    validate: {
      association: (value) => {
        if (selectedAssociations.length == 0) {
          return 'Veuillez séléctionner l(es) association(s)'
        }
        return null
      },
      description: (value) => (value != '' ? null : 'Veuillez saisir une description'),
    },
  });
console.log(props)
  const offerForm = useForm({
    initialValues: {
      category: '',
      title: openOffer ? openOffer.title : '',
      description: openOffer ? openOffer.description : ''
    },
    validate: {
    },
  });


  const submitOffer = (values) => {
    if (openOffer.type == 'Nationale') {
      Toast.error('Action impossible pour une offre globale')
      return
    }
    values = { ...values, offer: openOffer.id, selectedAssociations: editSelectedAssociations }
    setLoading(true)
    let body = serialize(values)
    fetch(`/api/admin/sponsoring-offer/association/add`, {
      method: 'POST',
      headers: new Headers({
        'JWTAuthorization': `Bearer ${getCookie('token')}`
      }),
      body: body
    })
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          res.data.code == 1
            ? Toast.success(res.data.message)
            : Toast.error(res.data.message)
          setLoading(false)
          openOfferHandler(null)
          offerForm.reset()
          router.reload(window.location.pathname)
        }
      })
      .catch((error) => {
        console.log('error', error)
        Toast.error('Erreur pendant l\'enregistrement')
        setLoading(false)
      })
  }

  const submitHandler = (values) => {
    setLoading(true)
    let body = serialize(values)
    body.append('association', selectedAssociations)
    fetch(`/api/sponsoring-offer`, {
      method: 'POST',
      headers: new Headers({
        'JWTAuthorization': `Bearer ${getCookie('token')}`
      }),
      body: body
    }).then(res => res.json())
      .then(res => {
        if (res.data) {
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
  const associationsSelect = props.associations.map((a) => {
    return (
      { ...a, label: a.name, value: a.id }
    )
  })
  // add label to existing array
  const associationsSelectEdit = props.associations.map((a) => {
    // ne pas pouvoir selectionner/deselectionné les associations existantes
    if (originalSelectedAssociations.includes(a.id)) {
      return (
        { ...a, label: a.name, value: a.id, disabled: true }
      )
    }
    return (
      { ...a, label: a.name, value: a.id }
    )
  })

  const SelectItem = forwardRef(
    ({ avatar, name, ...others }, ref) => {
      return (
        <div ref={ref} {...others}>
          <Group noWrap>
            <Avatar radius={'xl'} src={avatar == null ? null : `/uploads/${avatar.name}`} />
            <div>
              <Text size="sm">{name}</Text>
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


  const TextPopOver = ({ text }) => {
    const [opened, { close, open }] = useDisclosure(false);
    return (
      <Popover width={300} position="bottom" withArrow shadow="md" opened={opened}>
        <Popover.Target>
          <Text onMouseEnter={open} onMouseLeave={close} fz={'sm'} weight={550} lineClamp={1}>{text}</Text>
        </Popover.Target>
        <Popover.Dropdown sx={{ pointerEvents: 'none', bottom: '5px' }} >
          <Text className='tw-relative tw-bottom-[9px]' size="sm">{text}</Text>
        </Popover.Dropdown>
      </Popover>
    )
  }

  const OfferRow = ({ offer }) => {
    let avatar = <Avatar className='tw-shadow-md' radius={'xl'} src={null} />
    if (offer.associations.length == 1) {
      avatar = <Avatar className='tw-shadow-md' radius={'xl'} src={`/uploads/${offer.associations[0].avatar?.name}`} />
    }
    if (offer.associations.length > 1) {
      avatar = <Avatar.Group spacing="sm">
        <Avatar className='tw-shadow-md' size={'sm'} radius={'xl'} src={`/uploads/${offer.associations[0].avatar?.name}`} />
        <Avatar className='tw-shadow-md' size={'sm'} radius={'xl'} src={`/uploads/${offer.associations[1].avatar?.name}`} />
        {offer.associations.length > 2 &&
          <Avatar radius="xl" size={'sm'}>+{offer.associations.length - 2}</Avatar>
        }
      </Avatar.Group>
    }


    return (
      <Card className=' tw-bg-gray-100 tw-mb-2' radius={'lg'}>
        <Flex>
          <Center>
            {avatar}
          </Center>
          <Flex direction={'column'} className='tw-flex-1 tw-px-5'>
            <Flex justify={'space-between'}>
              <TextPopOver text={offer.title} />
            </Flex>
            <Text color='dimmed'>{offer.description}</Text>
          </Flex>
          <Center>
            <Flex direction={'column'}>
              <Group position='right' mb={'xs'}>
                <SponsoringOfferTypeBadge offer={offer} />
              </Group>
              <Status offer={offer} />
              <Group position='right'>
                <Button
                  onClick={() => openOfferHandler(offer)}
                  styles={{
                    root: { height: '20px' }
                  }}
                  size='xs' color='gray'
                  className='tw-bg-gray-500 tw-font-light' radius={'lg'}
                >Détails</Button>
              </Group>
            </Flex>
          </Center>
        </Flex>
      </Card>
    )
  }

  let id = useId();
  const offersList = <>
    <section style={styles} className='tw-px-3'>
      {sponsorOffers.map((offer) => (
        <OfferRow key={`${offer.id}-${id}`} offer={offer} />
      ))}
    </section>
  </>

  return (
    <>
      <Head>
        <title>PACE'SPORT</title>
        <meta name="description" content="PACE'SPORT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${styles.main}`} >
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

          <CardsSection title="Mes partenariats">
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
          size="calc(90vw - 5%)"
          radius={'lg'}
          centered
          opened={opened}
          onClose={() => setOpened(null)}
          title={<Text weight={600} fz={'xs'}>Soutenir une association</Text>}
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
              size="sm"
              data={['Globale', 'Locale']}
              color="gray"
              className='tw-border-[1px] tw-border-b-0 tw-border-white tw-mb-4'
            />

            <Text className='tw-font-light' fz={'sm'} mb={'xl'}>
              {tab == 'Nationale'
                ? 'Une offre globale sera accessible pour les abonnés de n\'importe quelle association'
                : 'Une offre locale sera accessible pour les abonnés des associations séléctionnées'
              }
            </Text>

            <MultiSelect
              maxSelectedValues={maxSelectedAssociations}
              label="Association à soutenir"
              placeholder="Choisir"
              itemComponent={SelectItem}
              data={associationsSelect}
              onChange={setselectedAssociations}
              value={selectedAssociations}
              maxDropdownHeight={400}
              mb={'md'}
              onDropdownClose={() => console.log('closing')}
            />

            <Textarea size="xs" mb={'sm'} label="Description de l'offre"
              minRows={3}
              autosize
              withAsterisk
              {...form.getInputProps('description')} />

            <Center>
              <Button className='tw-bg-lime-600 hover:tw-bg-teal-600'
                radius={'lg'} size="sm" variant="filled"
                type='submit'
                disabled={loading}>
                Envoyer mon offre</Button>
            </Center>
          </form>
        </Modal>
        <Modal
          size="calc(100vw - 5%)"
          radius={'lg'}
          centered
          opened={openOffer}
          onClose={() => openOfferHandler(null)}
          title={<Title order={4}>Détails offre</Title>}
        >
          <Group mb={'sm'}>
            <Text weight={600} fz={'sm'}>Sponsor</Text>
            <Flex>
              <Avatar className='tw-shadow-md' radius={'lg'} size={'sm'} src={`/uploads/${openOffer?.enseigne?.avatar?.name}`} />
              <Text fz={'sm'}>{openOffer?.enseigne?.name}</Text>
            </Flex>
          </Group>
          <Group mb={'sm'}>
            <Text weight={600} fz={'sm'}>Date création</Text>
            <Text fz={'sm'}>{moment(openOffer?.createdAt).format('DD/MM/YYYY')}</Text>
          </Group>
          <Group mb={'sm'}>
            <Text weight={600} fz={'sm'}>Titre</Text>
            <Text fz={'sm'}>{openOffer?.title}</Text>
          </Group>
          <Group mb={'sm'}>
            <Text weight={600} fz={'sm'}>Description</Text>
            <Text fz={'sm'}>{openOffer?.description}</Text>
          </Group>
          <Group mb={'sm'}>
            <Text weight={600} fz={'sm'}>Type</Text>
            {openOffer &&
              <SponsoringOfferTypeBadge offer={openOffer} />
            }
          </Group>
          <Flex mb={'sm'}>
            <Flex className='tw-h-full' direction={'column'} align={'start'} mr={'md'}>
              <Text weight={600} fz={'sm'}>Association(s)</Text>
            </Flex>
            <Stack>
              {openOffer &&
                openOffer.associations.map((asso) => (
                  <Flex key={asso.id}>
                    <Avatar className='tw-shadow-md' radius={'lg'} size={'sm'} src={`/uploads/${asso.avatar?.name}`} />
                    <Text fz={'sm'}>{asso.name}</Text>
                  </Flex>
                ))
              }
            </Stack>
          </Flex>
          <Title mt={'xl'} order={5}>Modifier offre</Title>
          <form onSubmit={offerForm.onSubmit((values) => submitOffer(values))} className="tw-p-4">
            {/* <TextInput mt="sm" description={"Titre de l'offre"} radius="md" size="sm" withAsterisk
                        mb={'md'}
                        {...offerForm.getInputProps('title')}/>
                        
                    <Textarea mt="sm" name={"name de l'offre"} radius="md" size="sm" withAsterisk
                        minRows={3}
                        mb={'md'}
                        {...offerForm.getInputProps('description')}/> */}
            <MultiSelect
              disabled={openOffer?.type == 'Nationale'}
              label="Ajouter association(s)"
              placeholder="Choisir"
              itemComponent={SelectItem}
              data={associationsSelectEdit}
              onChange={setEditSelectedAssociations}
              value={editSelectedAssociations}
              maxDropdownHeight={400}
              mb={'md'}
              onDropdownClose={() => console.log('closing')}
            />
            <Flex justify={'flex-end'} mt={'xl'}>
              <Button size="sm" ml={'lg'} px={'sm'} className="tw-text-xs"
                variant="outline"
                onClick={() => openOfferHandler(null)}
              >Annuler</Button>
              <Button size="sm" ml={'lg'} px={'sm'} className="tw-text-xs tw-bg-blue-600"
                type="submit"
                disabled={loading || openOffer?.type == 'Nationale'}
              >Valider</Button>
            </Flex>
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
    })
  }
  )
  const data = await res.json()

  // fetch avatar
  let avatar = await fetch(`${process.env.API_URL}/api/enseigne/avatar`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  avatar = await avatar.json();

  // fetch Associations
  let associations = await fetch(`${process.env.API_URL}/api/association/list`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  associations = await associations.json();

  let backgroundImage = await fetch(`${process.env.API_URL}/api/sponsor/background`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  backgroundImage = await backgroundImage.json();

  let offers = await getOffers(token)

  // // Pass data to the page via props
  return {
    props: {
      backgroundImage: backgroundImage.filename,
      cards: data?.data ? JSON.parse(data.data) : null,
      avatar: avatar.filename,
      associations: associations?.data ? JSON.parse(associations.data) : null,
      offers: offers?.data ? JSON.parse(offers.data) : null
    }
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}