import Head from "next/head";
import Layout from "./layout";
import { useEffect, useState } from 'react';
import { Stepper, Button, Group, TextInput, Text, Box, NumberInput, Flex, Modal, Skeleton, Progress, Title, Dialog, Space, Spoiler, Image, Accordion,Button, BsArrowLeft } from '@mantine/core';
import 'dayjs/locale/fr';
import CampagneHeaderEditable from "@/components/CampagneHeaderEditable";
import fileUploader from "@/utils/fileUploader";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CollectiviteAssociationCard from "@/components/CollectiviteAssociationCard";
;
import AssociationCardToAdd from "@/components/collectivite/AssociationCardToAdd";

export default function Page(props){
    const [cardList, setCardList] = useState([])
    const [availableCards, setAvailableCards] = useState(props.cards)
    const [imageFile, setImageFile] = useState(null)
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [progressColor, setProgressColor] = useState('red')
    const [page, setPage] = useState(1)
    const { push } = useRouter()
    const addToCardList = (id) => {
        let idx = availableCards.findIndex(x => x.id == id)
        if (idx > -1) {
            console.log('availableCards', availableCards)
            let newCards = [...availableCards]
            newCards.splice(idx, 1)
            console.log('newCards', newCards)
            setAvailableCards(newCards)
            setCardList([...cardList, {...availableCards[idx], percentage:0}])
            console.log('availableCards', availableCards)
            console.log('cardList', cardList)
        }
    }

    const removeFromCardList = (id) => {
        let idx = cardList.findIndex(x => x.id == id)
        if (idx > -1) {
            let newCardList = [...cardList]
            setAvailableCards([...availableCards, {...cardList[idx]}])
            newCardList.splice(idx, 1)
            setCardList(newCardList)
        }
    }

    const Cards = availableCards.map((card) => 
        <AssociationCardToAdd key={card.name + card.id} card={card} addToCardList={addToCardList} />
    )
    const CardList = availableCards.length == 0
        ? <Text align="center" color="dimmed">Aucune carte enregistrée</Text>
        : Cards

    
    const addedCards = cardList.map((card) => 
        <CollectiviteAssociationCard status={card.status} key={card.id} card={card} removeFromCardList={removeFromCardList}
            cardList={cardList} setCardList={setCardList} setProgress={setProgress}/>
    )
    const addedCardsList = cardList.length == 0
        ? <Text align="center" color="dimmed">Aucune carte enregistrée</Text>
        : addedCards

    const postCard = () => {
    }

    const submitHandler = () => {
        console.log('submitting');
    }
    useEffect(() => {
       let progressColor = progress <= 25 
            ? "red"
            : progress <= 50
                ? "orange"
                : progress <= 75 
                    ? "yellow"
                    : "green"
        setProgressColor(progressColor)
    }, [progress, cardList])
    



    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Ajouter campagne</title>
            </Head>       
            <CampagneHeaderEditable image={image} setImage={setImage} setImageFile={setImageFile}/>
            <main className="tw-bg-gradient-to-b tw-from-gray-100 tw-to-white tw-rounded-t-[2rem] tw-relative -tw-mt-7"
                style={{ minHeight: 'calc(100vh - 180px)' }}>
                            <Button variant="filled" id="goBackButton" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button>
                <section className="tw-px-2 tw-pt-4 tw-border-[1px] tw-border-green-500/50 tw-rounded-2xl tw-shadow-sm tw-m-2">
                    <Title order={3} mb={'sm'}>Ajouter une carte</Title>
                    <Progress className="tw-contrast-[.8]"mt={'sm'}  size="lg" value={progress} striped radius={'lg'}
                    color={progressColor}/>
                    <Text color={progressColor} weight={600}>{progress} %</Text>
                    <Space my={'md'}/>
                    <Box>{addedCardsList}</Box>
                    <Button className="tw-w-full tw-mx-auto tw-bg-teal-600 hover:tw-bg-teal-700 disabled:tw-border-2 disabled:tw-border-gray-100" 
                        disabled={progress < 100}
                        my={'md'} radius={'lg'} size="sm" variant="filled" 
                        onClick={() => submitHandler()}>Enregister</Button>
                </section>  
                <section className="tw-bg-white tw-mt-6 tw-shadow-inner tw-py-5 tw-px-4">
                    <Box>{CardList}</Box>
                </section>

                <Space h={'xl'} mt={'xl'} />
                <Space h={'xl'} mt={'xl'} />
                <Space h={'xl'} mt={'xl'} />
            </main>
            <script dangerouslySetInnerHTML={{ __html: `
            // Attacher un gestionnaire d'événements au bouton
            document.getElementById('goBackButton').addEventListener('click', function() {
                // Appeler la fonction pour revenir en arrière dans l'historique
                window.history.back();
            });
        `}} />
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']

    let cards = await fetch(`${process.env.API_URL}/api/discount-card/association/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    cards = await cards.json();
    if (cards.code == 401)
        return {
            redirect: {
            permanent: false,
            destination: "/login"
            }
    }
    
    // // Pass data to the page via props
    return { props: {
        cards: JSON.parse(cards.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }