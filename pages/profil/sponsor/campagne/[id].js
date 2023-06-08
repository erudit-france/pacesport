import { Box, Button, Divider, Flex, Group, Space, Text, TextInput, Textarea, Title } from "@mantine/core"
import Layout from "./layout"
import PageStatusIndicator from "../../association/campagne/ajouter/components/PageStatusIndicator"
import moment from "moment"
import PreviousPageButton from "@/components/PreviousPageButton"
import Head from "next/head"
import { useForm } from "@mantine/form"
import Toast from "@/services/Toast"
import { serialize } from "object-to-formdata"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"
import { useState } from "react"
import AssociationAcceptedOffers from "@/components/AssociationAcceptedOffers"

export default function Page(props) {
  const { card } = props
  const { offer } = props
  const { acceptedOffers } = props
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const DiscountOfferSection = () => {
    if (offer == null) {
      return (
        <Box  className="tw-border-[1] tw-border-t-red-600 tw-border-b-red-600 tw-p-4">
          <Title order={4} align="center">Mon offre</Title>
          <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
            <Textarea autosize label="Description" withAsterisk minRows={4} radius={'md'}
                        {...form.getInputProps('description')} />
            <Flex justify={'center'} mt={'md'}>
              <Button className="tw-mx-auto tw-bg-lime-600 hover:tw-bg-teal-600" 
                radius={'lg'} size="sm" variant="filled" 
                type="submit" disabled={loading}>Envoyer</Button></Flex>
          </form>
        </Box>
      )
    }
    return (
      <Box  className="tw-border-[1] tw-border-t-red-600 tw-border-b-red-600 tw-p-4">
        <Title order={4} align="center">Mon offre</Title>
          <Textarea autosize label="Créée le" radius={'md'} readOnly
            value={moment(offer.createdAt).format('DD/MM/YYYY')} />
          <Textarea autosize label="Description" minRows={4} radius={'md'} readOnly
            value={offer.description} />
          
          {offer.isAccepted &&
            <Text className="tw-text-green-600 tw-font-semibold" mt={'md'} fz={'sm'} align="center">Offre validée par l&lsquo;association</Text>
          }

          {!offer.isAccepted &&
            <Text className="tw-text-gold-500 tw-font-semibold" mt={'md'} fz={'sm'} align="center">En attente de validation par l&lsquo;association</Text>
          }
      </Box>
    )
  }

  const form = useForm({
      initialValues: {
          description: '',
      },
      validate: {
        description: (value) => (value != '' ? null : 'Veuillez saisir une description'),
      },
  });

  const submitHandler = (values) => {
    setLoading(true)
    let body = serialize({...values, cardId: card.id});
    fetch(`/api/discount-offer`, {
        method: 'POST',
        headers: new Headers({
          'JWTAuthorization': `Bearer ${getCookie('token')}`
        }),
        body: body
      })
    .then(res => res.json())
    .then(res => {
        if (res.data) {
          Toast.success(res.data.message)
          router.push('/profil/sponsor')
        }
      })
    .catch((error) => { Toast.error('Erreur pendant l\'enregistrement de l\'offre') })
    form.reset();
      setLoading(false)
  }
  return (
      <>
        <Head><title>Pace&lsquo;Sport - Sponsor - Campagne</title></Head>
        <section className="tw-p-3 tw-pt-0">
          <Flex>
            <PreviousPageButton href='/profil/sponsor' className='tw-mb-4 tw-absolute'/>
            <Title order={3} align="center" transform="capitalize" className="tw-flex-1">{card.name}</Title>
          </Flex>
          <Group my={'md'} className="tw-rounded-xl tw-border-[1px] tw-border-gray-400 tw-p-2">
            <Text className='' color="">Association:</Text>
            <Text className="tw-font-light">{card.association.name}</Text>
          </Group>
          <div className="tw-rounded-xl tw-border-[1px] tw-border-gray-400 tw-shadow-sm tw-p-3">
              <Flex>
                  <PageStatusIndicator page={1} currentPage={1} relative={false}/>
                  <Flex direction={'column'} className="tw-flex-1 tw-ml-3">
                      <Text size={'sm'} className="tw-font-semibold">{card.nom}</Text>
                      <Text size={'sm'}>Du {moment(card.dateDebut).format('DD/MM/YYYY')} au {moment(card.dateFin).format('DD/MM/YYYY')}</Text>
                  </Flex>
              </Flex>
          </div>

          
          <div className="tw-rounded-xl tw-border-[1px] tw-border-gray-400 tw-shadow-sm tw-p-3 tw-mt-2">
              <Flex>
                  <PageStatusIndicator page={2} currentPage={2} relative={false}/>
                  <Flex direction={'column'} className="tw-flex-1 tw-ml-3">
                      <Text size={'sm'} className="">Montant {card.prix}</Text>
                      <Text size={'sm'}>Nombre de cartes {acceptedOffers.length}</Text>
                  </Flex>
              </Flex>
          </div>
        </section>


        <Divider my="xl" h={'lg'}/>

        <DiscountOfferSection />

        <Box mt={'xl'}>
            <Title align="center" color="white" className="tw-bg-red-600 tw-font-light tw-pb-1" order={6}>Offres validées par l&lsquo;association</Title>
            <AssociationAcceptedOffers offers={acceptedOffers} />
            <Space my={'lg'} />
        </Box>  
      </>
  )
}

export async function getServerSideProps(context) {
    const id = context.query.id
    const token = context.req.cookies['token']
    const res = await fetch(`${process.env.API_URL}/api/discount-card/${id}`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
      )
    const data = await res.json()
    
    let offerRes = await fetch(`${process.env.API_URL}/api/discount-enseigne-offer-pending/${id}`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
      )
    let offerData = await offerRes.json()

    let acceptedOffersRes = await fetch(`${process.env.API_URL}/api/discount-enseigne-all-offer-accepted/${id}`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
      )
    let acceptedOffers = await acceptedOffersRes.json()
    
    // // Pass data to the page via props
    return { props: { 
      card: JSON.parse(data.data),
      offer: JSON.parse(offerData.data),
      acceptedOffers: JSON.parse(acceptedOffers.data)
    } }
  }
  
  Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }