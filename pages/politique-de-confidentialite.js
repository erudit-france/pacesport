import { BackgroundImage, Box, Center, Container, Image, Text, Title ,Button} from "@mantine/core"; 
import { BsArrowLeft } from "react-icons/bs";
import Head from "next/head";
import Link from 'next/link';


export default function ConditionsGeneralesVente() {
    const json = {

        "page": "Politique de confidentialité | Pacesport",
        "title": "Politique de confidentialité de Pace'sport",
        "sub": "Date d'entrée en vigueur : 13/07/2023",
        "section": "La présente politique de confidentialité décrit comment Pace'sport collecte, utilise, divulgue et protège les informations personnelles des utilisateurs de notre application mobile. Chez Pace'sport, nous attachons une grande importance à la protection de votre vie privée et nous nous engageons à respecter les lois et réglementations applicables en matière de protection des données.",
        "pre": "La présente politique de confidentialité décrit comment Pace'sport collecte, utilise, divulgue et protège les informations personnelles des utilisateurs de notre application mobile. Chez Pace'sport, nous attachons une grande importance à la protection de votre vie privée et nous nous engageons à respecter les lois et réglementations applicables en matière de protection des données.",
        "sections": [
            {
            "title": "1. Informations collectées",
            "section": [
                "1.1 Informations personnelles : Lors de votre utilisation de l'application Pace'sport, nous pouvons collecter certaines informations personnelles vous concernant, telles que votre nom, votre adresse e-mail, votre numéro de téléphone, votre adresse postale, votre date de naissance, ainsi que d'autres informations nécessaires pour créer et gérer votre compte.\n\n",
                "1.2 Informations de localisation : Avec votre consentement, nous pouvons collecter des informations sur votre localisation géographique lorsque vous utilisez l'application Pace'sport. Ces informations sont utilisées pour vous fournir des promotions et des offres adaptées à votre emplacement.\n\n",
                "1.3 Informations de transaction : Lorsque vous effectuez des transactions ou des achats via l'application Pace'sport, nous collectons les informations nécessaires pour traiter votre paiement, telles que les détails de votre carte de crédit ou de votre compte bancaire."
            ]
            },
            {
            "title": "2. Utilisation des informations",
            "section": [
                "2.1 Fourniture de services : Les informations collectées sont utilisées pour vous fournir les services et les fonctionnalités de l'application Pace'sport, y compris l'accès aux promotions, aux offres et aux informations sur les associations locales.\n\n",
                "2.2 Communication : Nous pouvons utiliser vos informations personnelles pour vous contacter et vous envoyer des notifications liées à votre utilisation de l'application Pace'sport, telles que des mises à jour, des offres spéciales ou des informations sur les associations que vous soutenez.\n\n",
                "2.3 Amélioration de l'expérience utilisateur : Les informations collectées nous aident à comprendre comment vous utilisez notre application, afin d'améliorer constamment notre service, d'optimiser notre contenu et de personnaliser votre expérience.\n\n",
                "2.4 Marketing : Avec votre consentement, nous pouvons utiliser vos informations personnelles pour vous envoyer des communications marketing relatives aux promotions, aux offres spéciales et aux nouveautés de Pace'sport. Vous pouvez choisir de ne plus recevoir ces communications à tout moment en modifiant les paramètres de votre compte ou en utilisant les liens de désabonnement fournis dans les e-mails."
            ]
            },
            {
            "title": "3. Partage des informations",
            "section": [
                "3.1 Partenaires commerciaux : Nous pouvons partager vos informations personnelles avec nos partenaires commerciaux, tels que les enseignes locales, afin de vous fournir des promotions et des offres spéciales pertinents. Toutefois, nous ne partagerons pas vos informations de paiement avec ces tiers sans votre consentement.\n\n",
                "3.2 Obligations légales : Nous pouvons divulguer vos informations personnelles si la loi l'exige, dans le cadre d'une procédure judiciaire, pour protéger nos droits légaux ou pour répondre à une demande légale des autorités compétentes."
                ]
            },
            {
            "title": "4. Sécurité des informations",
            "section": [
                "Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations personnelles contre tout accès non autorisé, utilisation abusive, divulgation ou destruction. Cependant, veuillez noter qu'aucune méthode de transmission ou de stockage électronique n'est totalement sécurisée. Par conséquent, nous ne pouvons garantir la sécurité absolue de vos informations."
                ]
            },
            {
            "title": "5. Vos droits",
            "section": [
                "Vous avez le droit d'accéder, de corriger, de mettre à jour ou de supprimer les informations personnelles que nous détenons vous concernant. Vous pouvez exercer ces droits en accédant aux paramètres de votre compte ou en nous contactant directement."
            ]
            },
            {
            "title": "6. Modifications de la politique de confidentialité",
            "section": [
                "Nous pouvons mettre à jour cette politique de confidentialité périodiquement pour refléter les changements apportés à nos pratiques en matière de protection des données. Nous vous encourageons à consulter régulièrement cette politique pour rester informé de la manière dont nous collectons, utilisons et protégeons vos informations."
                ]
            },
            {
            "title": "7. Nous contacter",
            "section": [
                "Si vous avez des questions, des préoccupations ou des commentaires concernant cette politique de confidentialité ou nos pratiques en matière de protection des données, veuillez nous contacter à l'adresse suivante : [Insérer les coordonnées de contact]."
                ]
            },
            {
            "title": "11. Conservation des données",
            "section": [
                "Nous conservons vos informations personnelles aussi longtemps que nécessaire pour atteindre les finalités pour lesquelles elles ont été collectées, ainsi que pour respecter nos obligations légales. Si vous souhaitez que nous supprimions vos informations personnelles, veuillez nous contacter à l'adresse indiquée ci-dessous."
                ]
            },
            {
            "title": "12. Transfert international des données",
            "section": [
                "En tant qu'application mobile soutenant les associations locales et proposant des promotions auprès de nombreuses enseignes en France, il est possible que vos informations personnelles soient transférées et traitées dans des pays en dehors de l'Espace économique européen (EEE) où les lois sur la protection des données peuvent différer. Dans de tels cas, nous prendrons les mesures appropriées pour assurer un niveau adéquat de protection de vos informations conformément aux lois applicables sur la protection des données."
                ]
            },
            {
            "title": "13. Consentement et modifications de la politique de confidentialité",
            "section": [
                "En utilisant l'application Pace'sport, vous consentez à la collecte, à l'utilisation et à la divulgation de vos informations personnelles conformément à la présente politique de confidentialité. Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. En cas de modification, la politique de confidentialité mise à jour sera publiée dans l'application avec la date d'entrée en vigueur révisée. Votre utilisation continue de l'application après la publication de modifications constitue votre acceptation de ces modifications."
                ]
            },
            {
            "title": "14. Nous contacter",
            "section": [
                "Si vous avez des questions, des préoccupations ou des demandes concernant notre politique de confidentialité ou nos pratiques en matière de traitement des données personnelles, veuillez nous contacter à l'adresse suivante :\n\ncontact@pacesport.fr\n\nNous nous efforcerons de répondre à vos demandes dans les meilleurs délais.\n\nMerci d'avoir lu notre politique de confidentialité."
                ]
            }
        ]
    }

    const render = Object.keys(json).map((key, i) => {
        let val = json[key]
        switch (key) {
            case 'page':
                return <Head key={i}><title>{val}</title></Head>
            case 'title':
                return <Title key={i} mb={'md'} order={2} align="center">{val}</Title>
            case 'sub':
                return <Title key={i} mb={'md'} order={5} className="tw-font-thin">{val}</Title>
            case 'pre':
                return <Text key={i} mb={'md'}>{val}</Text>
            case 'sections':
                return val.map((section, idx) => {
                    return (
                        <Box key={section.title}>
                            <Title order={6} mb={'md'}>{section.title}</Title>
                            {section.section.map((text, idz) => (
                                <Text key={idz} mb={'md'}>{text}</Text>
                            ))}
                        </Box>
                    )
                })}
        }
    )

    return <>
        <main className="tw-h-screen tw-rounded-t-2xl">
            <BackgroundImage className="tw-h-full tw-opacity-10 tw-absolute tw-top-0 -tw-z-10" src='/doodle-pattern.png' />
            <Container p={'lg'}>
            <Center className='tw-absolute tw-left-2 tw-top-0.5'>
            <Link href="/parametres">
            <Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-ml-5 tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button></Link>
              </Center>
                <Center>
                    <Image src={'/logo.png'} width={80} alt="Logo Pace'sport" 
                            className='tw-rounded-full shadow-sm tw-bg-white tw-p-2 tw-m-4'/>
                </Center>
                {render}
            </Container>
        </main>
    </>
}