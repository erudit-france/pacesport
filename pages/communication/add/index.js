import { Box, Flex, Text, Textarea } from "@mantine/core"
import Layout from "./layout"
import { useForm } from "@mantine/form";
import PreviousPageButton from "@/components/PreviousPageButton";

const PriceRow = ({credits, price, oldPrice}) => {
    return (
        <Flex className="tw-py-2">
            <Flex className="tw-w-1/2">
                <Text className="tw-text-white tw-font-semibold tw-mx-auto tw-my-auto" align="center" weight={'bold'} size={'lg'}>{credits} Crédits</Text>
            </Flex>
            <Flex className="tw-w-1/2 tw-flex tw-flex-col" direction={'col'}>
                <Text className="tw-text-white tw-font-semibold" align="center" size={'lg'}>{price} €</Text>
                {oldPrice &&
                    <Text className="tw-text-gray-600 tw-line-through tw-font-semibold tw-text-sm" align="center" size={'lg'}>{oldPrice} €</Text>
                }
            </Flex>
        </Flex>
    )
}

export default function Page(props) {
    const form = useForm({
        initialValues: {
            message: '',
        },
        validate: {
          message: (value) => (value != '' ? null : 'Veuillez saisir un message'),
        },
    });

    const submitHandler = (values) => {
        console.log('values', values)
    }

    return (
        <>
            <div className="tw-container tw-mx-auto tw-px-2">
                <Box my={'sm'}>
                    <PreviousPageButton href={props.previousUrl}/>
                </Box>
                <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
                    <Textarea
                        size="md"
                        placeholder="Contenu du message"
                        label="Contenu du message publicitaire"
                        withAsterisk
                        {...form.getInputProps('message')}/>

                    <Flex justify={'center'} mt={'md'}>
                        <button type="submit" 
                            className="tw-bg-gray-200 hover:tw-bg-gray-300/75
                                    tw-rounded-3xl tw-shadow-sm tw-px-4 tw-py-3">
                            <span className="tw-text-gray-800">Envoyer</span>
                            <span className="tw-text-yellow-700"> 1 crédit</span>
                        </button>
                    </Flex>

                    <Text className="tw-text-gray-700" mt="xl" mb='xs' size={'sm'} align="center">Un crédit Offert par mois</Text>
                    <Text className="tw-text-gray-700" size={'sm'} align="center">Un crédit = une publication par jour</Text>
                </form>
            </div>

            {/* gold pricing section */}
            <section className="tw-bg-yellow-600/60 tw-mt-4">
                <PriceRow credits={3} price={5.99} />
                <PriceRow credits={10} price={12.99} oldPrice={19.99} />
                <PriceRow credits={20} price={15.99} oldPrice={39.99} />
                <PriceRow credits={40} price={19.99} oldPrice={79.99} />
            </section>


        </>
    )
}


export async function getServerSideProps(context) {
    let url = context.req.headers.referer
    let previousUrl = url === undefined ? '/profil/sponsor/' : url
    // // Pass data to the page via props
    return { props: { 
        previousUrl: previousUrl
    } }
}


Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }