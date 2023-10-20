import { Box, Button, Center, Flex, Group, Modal, Text, Textarea, Title } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";
import Layout from "../layout"
import { useForm } from "@mantine/form";
;
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";
import { useState } from "react";
import { serialize } from "object-to-formdata";
import { getUser } from "@/domain/repository/UserRepository";

const PriceRow = ({ credits, price, oldPrice, click }) => {
    return (
        <Flex className="tw-py-2">
            <Flex className="tw-w-1/2">
                <Text className="tw-text-white tw-font-semibold tw-mx-auto tw-my-auto" align="center" weight={'bold'} size={'lg'}>{credits} Crédits</Text>
            </Flex>
            <Flex className="tw-w-1/2 tw-flex tw-flex-col" direction={'col'}>
                <Button onClick={click} radius={'lg'} className="tw-border-2 tw-border-gray-100 tw-shadow-md">
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
    const [loading, setLoading] = useState(false);
    const [iframeUrl, setIframeUrl] = useState(null)
    const [opened, setOpened] = useState(false)
    const [credit, setCredit] = useState(0)
    const [price, setPrice] = useState(0)
    const router = useRouter()
    const form = useForm({
        initialValues: {
            message: '',
        },
        validate: {
            message: (value) => (value != '' ? null : 'Veuillez saisir un message'),
        },
    });

    const closeModalHandler = () => {
        setOpened(false)
        setPrice(0)
        setCredit(0)
        setIframeUrl(null)
    }

    const getCreditUrl = (credit, price) => {
        setCredit(credit)
        setPrice(price)
        setOpened(true)
        setIframeUrl(`/api/payment/generate?orderType=credit&credit=${credit}&accountType=association&ref=${props.user.id}&baseurl=${props.baseUrl}`)
        return
    }

    const submitHandler = (data) => {
        console.log('data', data)
        let body = serialize({ ...data });
        if (data === undefined) return
        setLoading(true)

        fetch(`/api/communication/association`, {
            method: 'POST',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v2')}`
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
                    <Flex justify={'space-between'}>
                        <Button variant="filled" id="goBackButton" size="sm"
                            className="tw-bg-gray-50 tw-text-black tw-ml-5 tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full"
                            radius={'xl'}><BsArrowLeft /></Button>
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
                        {...form.getInputProps('message')} />

                    <Flex justify={'center'} mt={'md'}>
                        <Button type="submit" disabled={loading}
                            className="tw-bg-gray-200 hover:tw-bg-gray-300/75
                                    tw-rounded-3xl tw-shadow-sm">
                            <span className="tw-text-gray-800">Envoyer &nbsp;</span>
                            <span className="tw-text-[#d61515]"> 1 crédit</span>
                        </Button>
                    </Flex>

                    <Text className="tw-text-gray-700" mt="xl" mb='xs' size={'sm'} align="center" style={{ fontWeight: 'bold' }}>Un crédit offert par mois</Text>
                    <Text className="tw-text-gray-700" size={'sm'} align="center">Un crédit = une publication</Text>
                </form>
            </div>
            <script dangerouslySetInnerHTML={{
                __html: `
            // Attacher un gestionnaire d'événements au bouton
            document.getElementById('goBackButton').addEventListener('click', function() {
                // Appeler la fonction pour revenir en arrière dans l'historique
                window.history.back();
            });
        `}} />

            {/* gold pricing section */}
            <section className="tw-bg-[#d61515] tw-mt-4">
                <PriceRow click={() => getCreditUrl(3, 5.99)} credits={3} price={5.99} />
                <PriceRow click={() => getCreditUrl(10, 12.99)} credits={10} price={12.99} oldPrice={19.99} />
                <PriceRow click={() => getCreditUrl(20, 15.99)} credits={20} price={15.99} oldPrice={39.99} />
                <PriceRow click={() => getCreditUrl(40, 19.99)} credits={40} price={19.99} oldPrice={79.99} />
            </section>

            <Modal
                opened={opened}
                onClose={closeModalHandler}
                title={<Title order={5}>Acheter des crédits</Title>}
            >
                <Group grow>
                    <Text fw={600} fz={'sm'}>Nombre de crédits</Text>
                    <Text>{credit}</Text>
                </Group>
                <Group grow>
                    <Text fw={600} fz={'sm'}>Prix</Text>
                    <Text>{price} €</Text>
                </Group>
                <Center mt={'lg'}>
                    <iframe className="tw-w-full" height={600} src={iframeUrl}></iframe>
                </Center>
            </Modal>
        </>
    )
}


export async function getServerSideProps(context) {
    const token = context.req.cookies['token_v2']

    let url = context.req.headers.referer
    let previousUrl = url === undefined ? '/profil/sponsor/' : url

    let creditRes = await fetch(`${process.env.API_URL}/api/communication/association/credit`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    let creditData = await creditRes.json()

    let user = await getUser(token)
    if (user.code == 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }
    user = JSON.parse(user.data)

    // // Pass data to the page via props
    return {
        props: {
            credit: JSON.parse(creditData.data.credit),
            cancelUrl: `${process.env.NEXT_URL}${context.resolvedUrl}`,
            baseUrl: `${process.env.NEXT_URL}`.replace('http://', 'https://'),
            user: user
        }
    }
}


Page.getLayout = function getLayout(page) {
    return (
        <Layout>{page}</Layout>
    )
}