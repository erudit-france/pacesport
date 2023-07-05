import { Box, Button, Flex, Group, Text, Textarea } from "@mantine/core"
import Layout from "../layout"
import { useForm } from "@mantine/form";
import PreviousPageButton from "@/components/PreviousPageButton";
import Toast from "@/services/Toast";
import { useState } from "react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { serialize } from "object-to-formdata";

const PriceRow = ({credits, price, oldPrice, click}) => {
    return (
        <Flex className="tw-py-2">
            <Flex className="tw-w-1/2">
                <Text className="tw-text-white tw-font-semibold tw-mx-auto tw-my-auto" align="center" weight={'bold'} size={'lg'}>{credits} Crédits</Text>
            </Flex>
            <Flex className="tw-w-1/2 tw-flex tw-flex-col" direction={'col'}>
                <Button  onClick={click} radius={'lg'} className="tw-border-2 tw-border-gray-100 tw-shadow-md">
                    <Text className="tw-text-white tw-font-semibold" align="center" size={'lg'}>{price} €</Text>
                    {oldPrice &&
                        <Text className="tw-text-gray-600 tw-line-through tw-font-semibold tw-text-sm tw-pl-2" align="center" size={'lg'}>{oldPrice} €</Text>
                    }
                </Button>
            </Flex>
        </Flex>
    )
}

export default function Page(props) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm({
        initialValues: {
            message: '',
        },
        validate: {
          message: (value) => (value != '' ? null : 'Veuillez saisir un message'),
        },
    });

    const submitHandler = (data) => {
        if (props.credit < 1) {
            Toast.error('Vous ne possédez pas assez de crédit')
        }
        let body = serialize({...data});
        if (data === undefined) return
        setLoading(true)

        fetch(`/api/communication/sponsor`, {
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

    const getCreditUrl = (credit) => {
        console.log(props.cancelUrl);
        fetch(`/api/stripe/credit`, {
            method: 'POST',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({
                credit: credit,
                cancelUrl: props.cancelUrl,
                baseUrl: props.baseUrl
            })
          })
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                router.push(res.data.url)
            }
          })
        .catch((err) => Toast.error('Erreur, veuillez réessayer plus tard'))
    }

    return (
        <>
            <div className="tw-container tw-mx-auto tw-px-2">
                <Box my={'sm'}>
                    <Flex justify={'space-between'}>
                        <PreviousPageButton href={props.previousUrl}/>
                        <Group className="tw-rounded-3xl tw-border-[1px] tw-border-gray-300 tw-shadow-sm tw-px-4 tw-mr-2">
                            <Text>Crédits:</Text>
                            <Text>{props.credit}</Text>
                        </Group>
                    </Flex>
                </Box>
                <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
                    <Textarea
                        size="md"
                        placeholder="Contenu du message"
                        label="Contenu du message publicitaire"
                        withAsterisk
                        {...form.getInputProps('message')}/>

                    <Flex justify={'center'} mt={'md'}>
                        <Button type="submit" 
                            className="tw-bg-gray-200 hover:tw-bg-gray-300/75
                                    tw-rounded-3xl tw-shadow-sm">
                            <span className="tw-text-gray-800">Envoyer &nbsp;</span>
                            <span className="tw-text-yellow-700"> 1 crédit</span>
                        </Button>
                    </Flex>

                    <Text className="tw-text-gray-700" mt="xl" mb='xs' size={'sm'} align="center">Un crédit Offert par mois</Text>
                    <Text className="tw-text-gray-700" size={'sm'} align="center">Un crédit = une publication par jour</Text>
                </form>
            </div>

            {/* gold pricing section */}
            <section className="tw-bg-yellow-600/60 tw-mt-4">
                <PriceRow click={() => getCreditUrl(3)} credits={3} price={5.99} />
                <PriceRow click={() => getCreditUrl(10)} credits={10} price={12.99} oldPrice={19.99} />
                <PriceRow click={() => getCreditUrl(20)} credits={20} price={15.99} oldPrice={39.99} />
                <PriceRow click={() => getCreditUrl(40)} credits={40} price={19.99} oldPrice={79.99} />
            </section>


        </>
    )
}


export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let url = context.req.headers.referer
    let previousUrl = url === undefined ? '/profil/sponsor/' : url
    
    let creditRes = await fetch(`${process.env.API_URL}/api/communication/sponsor/credit`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
        )
    let creditData = await creditRes.json()

    console.log('creditData', creditData)
    // // Pass data to the page via props
    return { props: { 
        previousUrl: previousUrl,
        credit: JSON.parse(creditData.data.credit),
        cancelUrl: `${process.env.NEXT_URL}${context.resolvedUrl}`,
        baseUrl: `${process.env.NEXT_URL}`
    } }
}


Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }