import { Box, Button, Flex, Text, Textarea } from "@mantine/core"
import Layout from "../layout"
import { useForm } from "@mantine/form";
import PreviousPageButton from "@/components/PreviousPageButton";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";
import { useState } from "react";
import { serialize } from "object-to-formdata";

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
    const [loading, setLoading] = useState(false);
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
        console.log('data', data)
        let body = serialize({...data});
        if (data === undefined) return
        setLoading(true)

        fetch(`/api/communication/association`, {
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
              router.push('/profil/association')
            }
          })
        .catch((error) => { Toast.error('Erreur pendant l\'enregistrement de l\'offre') })
        form.reset();
        setLoading(false)
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
                        <Button type="submit" disabled={loading}
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
            {/* <section className="tw-bg-yellow-600/60 tw-mt-4">
                <PriceRow credits={3} price={5.99} />
                <PriceRow credits={10} price={12.99} oldPrice={19.99} />
                <PriceRow credits={20} price={15.99} oldPrice={39.99} />
                <PriceRow credits={40} price={19.99} oldPrice={79.99} />
            </section> */}


        </>
    )
}


export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let hasActiveSubscriptionRes = await fetch(`${process.env.API_URL}/api/user/hasActiveSubscription`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    hasActiveSubscriptionRes = await hasActiveSubscriptionRes.json();

    if (hasActiveSubscriptionRes.data == null) {
        return {
            redirect: {
                permanent: false,
                destination: "/profil/association/business",
            },
            props:{},
        };
    }

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