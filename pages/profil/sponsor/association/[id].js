import Head from "next/head"
import Layout from "./layout"
import { ActionIcon, Box, Button, Center, Container, CopyButton, Flex, Grid, Group, Loader, Modal, Select, SegmentedControl, Space, Text, TextInput, Textarea, Title, Tooltip, MultiSelect } from "@mantine/core"
import AssociationCard from "@/components/AssociationCard"
import { useForm } from "@mantine/form";
import { forwardRef, useState } from 'react'
import Toast from "@/services/Toast";
import { serialize } from "object-to-formdata";
import { getCookie } from "cookies-next";
import { TbCopy, TbCheck } from "react-icons/tb"

export default function Page(props) {
  const association = props.association
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [maxSelectedAssociations, setMaxSelectedAssociations] = useState(99)
  const [tab, setTab] = useState('Nationale')
  const categoriesOffre = [
    { value: 'Alimentaire', label: 'Alimentaire' },
    { value: 'Vêtements', label: 'Vêtements' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Electronique', label: 'Electronique' },
  ]
  const form = useForm({
    initialValues: {
      association: association.id,
      description: '',
      type: 'Nationale',
    },
    validate: {
      description: (value) => (value != '' ? null : 'Veuillez saisir une description'),
    },
  });

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
        if (res.data) {
          Toast.success('Offre envoyée')
        }
        setLoading(false)
        setOpened(false)
        form.reset()
      })
      .catch((error) => {
        Toast.error('Erreur pendant l\'enregistrement de l\'offre')
        setLoading(false)
        setOpened(false)
      })
  }
  const tabHandler = (state) => {
    if (state == 'Locale') {
      setMaxSelectedAssociations(99)
    } else {
      setMaxSelectedAssociations(1)
    }
    setTab(state)
    form.setValues({ type: state })
  }

  const Information = ({ label, value }) => (
    <Flex className="tw-text-sm tw-mt-1">
      <Text>{label}:</Text>
      <Text ml={'lg'} weight={400}>{value}</Text>
      {label == 'Email' &&
        <CopyButton value={value} timeout={1500}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copié' : 'Copier'} withArrow position="right">
              <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                {copied ? <TbCheck size={14} /> : <TbCopy size={14} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      }
    </Flex>
  )

  const associationInformation = <Box className="tw-rounded-2xl tw-shadow-lg tw-bg-white tw-py-7 tw-px-6" >
    <Title order={2} weight={600} align="center">{association.name}</Title>
    <Text align="center" fz={'sm'}>{association.description}</Text>
    <Information label={'Adresse'} value={association.address} />
    <Information label={'Téléphone'} value={association.phone} />
    <Information label={'Email'} value={association.email} />
  </Box>

  return (
    <>
      <Head><title>Pace'Sport - {association.name}</title></Head>
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
                                    hover:tw-to-gray-200'>Soutenir l'association</Button>
        </Center>
        {/* <Center>
                    <Button size='md'
                        className='tw-text-black
                                    tw-px-8 tw-py-3 
                                    tw-bg-gradient-to-br tw-from-gray-200 tw-to-white
                                    tw-shadow-md tw-w-full tw-rounded-2xl
                                    tw-border-2 tw-border-white
                                    hover:tw-to-gray-200'>Contacter</Button>
                </Center> */}
      </Container>

      <Modal
        size="calc(90vw - 5%)"
        radius={'lg'}
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Text weight={700} fz={'xs'}>Soutenir une association</Text>}
      >

        <form className='tw-p-4' onSubmit={form.onSubmit((values) => submitHandler(values))}>
          <TextInput
            readOnly
            placeholder={association.name}
            label="Association"
            mb={'md'}
          />

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
            data={['Nationale', 'Locale']}
            color="gray"
            className='tw-border-[1px] tw-border-b-0 tw-border-white tw-mb-4'
          />

          <Textarea size="xs" mb={'sm'} label="Description de l'offre"
            minRows={3}
            autosize
            withAsterisk
            {...form.getInputProps('description')} />

          <Center>
            <Button className='tw-bg-lime-600 hover:tw-bg-teal-600'
              radius={'lg'} size="sm" variant="filled"
              type='submit'>
              {loading ? <Loader size={'xs'} color='teal' /> : 'Envoyer mon offre'}</Button>
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
    })
  }
  )
  const data = await res.json()

  let cards = await fetch(`${process.env.API_URL}/api/discount-card`, {
    headers: new Headers({
      'JWTAuthorization': `Bearer ${token}`,
    })
  }
  )
  cards = await cards.json()

  // // Pass data to the page via props
  return {
    props: {
      association: JSON.parse(data.data),
      cards: JSON.parse(cards.data),
      id: id
    }
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}