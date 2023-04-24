import { Box, Button, Flex, Text, Textarea, Title } from "@mantine/core"
import Layout from "./layout"
import PageStatusIndicator from "../../association/campagne/ajouter/components/PageStatusIndicator"
import moment from "moment"
import PreviousPageButton from "@/components/PreviousPageButton"
import Head from "next/head"
import { useForm } from "@mantine/form"

export default function Page(props) {
  const card = props.card
  const form = useForm({
      initialValues: {
          description: '',
      },
      validate: {
        description: (value) => (value != '' ? null : 'Veuillez saisir une description'),
      },
  });

  const submitHandler = (values) => {
    console.log('values', values)
    form.reset();
  }
  return (
      <>
        <Head><title>Pace&lsquo;Sport - Sponsor - Campagne</title></Head>
        <section className="tw-p-3 tw-pt-0">
          <PreviousPageButton href='/profil/sponsor' className='tw-mb-4'/>
          <Text weight={600} size={'lg'}>Carte: <span className="">{card.name}</span></Text>
          <Text color="dimmed" mb={'md'}>{card.association.name}</Text>
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
                      <Text size={'sm'}>Nombre de cartes {card.offers}</Text>
                  </Flex>
              </Flex>
          </div>
        </section>
        
        <Box mt={'xl'} className="tw-border-[1] tw-border-t-red-600 tw-border-b-red-600 tw-p-3">
          <Title order={5} align="center">Proposer une offre</Title>
          <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
            <Textarea autosize label="Description" withAsterisk minRows={4}
                        {...form.getInputProps('description')}/>
            <Flex justify={'center'}>
              <Button className="tw-mx-auto tw-bg-lime-600 hover:tw-bg-teal-600" 
                 radius={'lg'} size="sm" variant="filled" 
                type="submit">Envoyer</Button></Flex>
          </form>
        </Box>

        <Box mt={'xl'}>
            <Title align="center" color="white" className="tw-bg-red-600 tw-font-light tw-pb-1" order={6}>Offres validées par l&lsquo;association</Title>
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
  
    if(data.code == 401) 
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }
  
    // // Pass data to the page via props
    return { props: { 
      card: JSON.parse(data.data),
    } }
  }
  
  Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={page.props.card.image}>{page}</Layout>
    )
  }