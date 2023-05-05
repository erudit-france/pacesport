import { ActionIcon, Box, Button, Center, Divider, Flex, Modal, Space, Text, Title } from "@mantine/core";
import Head from "next/head";
import SearchSponsor from "./components/SearchSponsor";
import UserListButton from "./components/UserListButton";
import Layout from "./layout";
import SponsorInvitation from "./components/SponsorInvitation";
import { GoPlus } from 'react-icons/go'
import Link from "next/link";
import { BsLock, BsMegaphoneFill } from "react-icons/bs";
import { GrMoney } from "react-icons/gr";
import { BiMessage } from "react-icons/bi";
import CampagneCard from "./components/CampagneCard";
import { useDisclosure } from "@mantine/hooks";

export default function Page(props){
    const [openedBusinessModal, { open, close }] = useDisclosure(false);
    const isAccountLimited = true
    const Cards = props.cards.map((card) => 
        <CampagneCard id={card.id} key={card.name + card.id} title={card.name} image={card.image?.name} startDate={card.startDate} />
    )
    const CardList = props.cards.length == 1 
        ? <Text align="center" color="dimmed">Aucune carte enregistrée</Text>
        : Cards

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Mon compte</title>
                <meta name="description" content="PACE&lsquo;SPORT" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className="tw-px-4 tw-pt-8 tw-relative">
                {isAccountLimited && 
                    <Text fz={"sm"} className="tw-font-semibold" align="center" p='lg'>Votre accès est limité le temps que votre association soit validée</Text>}
                <SearchSponsor />
                <Flex mt={'md'} justify={'space-between'}>
                    <UserListButton prev={'/profil/association'} />
                    <Divider className="tw-border-gray-200 tw-mx-3 md:tw-mx-8" size="sm" orientation="vertical" />
                    <SponsorInvitation />
                </Flex>
                <ActionIcon component='a' href='/communication/add?prev=/profil/association' className="tw-bg-white tw-absolute tw-right-4 tw-top-4 tw-p-1.5" radius={'xl'}>
                    <BsMegaphoneFill className="tw-text-black" size={18} />
                </ActionIcon>
            </section>

            <section className="tw-bg-white tw-mt-6 tw-shadow-inner tw-py-5 tw-px-4">
                <Flex justify={'space-between'} my={'lg'} className="tw-relative">
                    <Text className="tw-flex-1" fz={'sm'} fw={'bold'} align={'center'} transform={'uppercase'} py={2}>Mon Pace&lsquo;sport</Text>
                        <Center>
                            <Link href="/profil/association/campagne/ajouter" 
                                className="tw-absolute tw-right-0 tw-bg-gray-900 tw-text-gray-100 tw-text-xs tw-rounded-3xl
                                hover:tw-bg-black tw-p-1.5">
                                <GoPlus size="1.2rem" />
                            </Link>
                        </Center>
                </Flex>
                <Box>{CardList}</Box>
            </section>

            <Space className="tw-mt-1"></Space>

            <section className="tw-bg-yellow-300/70 tw-flex tw-flex-col tw-py-4">
                <Text color="white" align="center">Offre de sponsoring</Text>
                <Text className="tw-flex tw-justify-center" align="center">Uniquement avec Pace&lsquo;sport Business<BsLock className='tw-my-auto tw-ml-1'/></Text>
                <Button onClick={open} color="white" variant="filled" size="xs" 
                    className="tw-bg-white tw-text-black hover:tw-bg-gray-200 tw-mx-auto tw-mt-3" radius={'lg'}>En savoir plus</Button>
            </section>

            
            <section className="tw-flex tw-flex-col tw-py-4">
                <Link href='/messages' className="tw-mx-auto tw-mt-3">
                    <Button color="white" variant="filled" size="sm" leftIcon={<BiMessage />} miw={200}
                        className="tw-bg-white tw-text-black hover:tw-bg-gray-200" radius={'lg'}>
                            Messagerie</Button></Link>
                <Link href='/gestion-fonds?prev=/profil/association' className="tw-mx-auto tw-mt-3">
                        <Button color="white" variant="filled" size="sm" leftIcon={<GrMoney />} miw={200}
                        className="tw-bg-white tw-text-black hover:tw-bg-gray-200" radius={'lg'}>
                            Gestion de fonds</Button></Link>
            </section>  
                
            <Modal radius={'lg'} className="modal-gold" opened={openedBusinessModal} onClose={close} centered
                title={<Title color="white" style={{textShadow: '#631 1px 0 10px'}} className="tw-mx-auto text-sha" transform="uppercase" align="center" order={3}>Pace&lsquo;Sport Business</Title>}>
                <Text className='tw-text-gray-100' fz={'sm'} mb={'sm'}>Ces fonctionnalités ne sont disponibles que dans l&lsquo;offre Pace&lsquo;Sport Business</Text>
                <Text className='tw-text-gray-100' fz={'sm'}>Débloquez des outils professionnels pour faciliter la gestion de votre association</Text>
                <Box align='center' mt={'md'}>
                <Link href='/profil/association/business'>
                    <Button radius={'lg'} 
                        className="tw-border-[1] tw-border-black tw-bg-gray-100 hover:tw-bg-gray-200 tw-shadow-md">
                        <Text color="dark">Rejoindre</Text>
                        <span>&nbsp;</span><Text className="tw-text-yellow-700"> BUSINESS</Text></Button>
                </Link>
                </Box>
            </Modal>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let avatar = await fetch(`${process.env.API_URL}/api/association/avatar`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
    )
    avatar = await avatar.json();
    if (avatar.code == 401) {
        return {
            redirect: {
            permanent: false,
            destination: "/login"
            }
        }
    }

    let cards = await fetch(`${process.env.API_URL}/api/discount-card/association/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    cards = await cards.json();
    
    // // Pass data to the page via props
    return { props: {
        avatar: avatar.filename,
        cards: JSON.parse(cards.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }