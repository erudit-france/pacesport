import { BackgroundImage, Box, Center, Container, Image, Text, Title,Button } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";
import Head from "next/head";
import React from "react";
import Link from 'next/link';


export default function ConditionsGeneralesVente() {
    const json = 
    {
        "page": "Conditions générales de vente | Pacesport",
        "title": "Conditions générales de vente (CGV) de Pace’sport pour l'achat de la carte dématérialisée",
        "sub": "Date d'entrée en vigueur : 13/07/2023",
        "pre": "Les présentes conditions générales de vente (ci-après dénommées \"CGV\") régissent l'achat de la carte dématérialisée proposée par Pace'sport (ci-après dénommée \"nous\" ou \"notre\") via l'application mobile Pace'sport. En effectuant un achat, vous acceptez pleinement et sans réserve les présentes CGV.",
        "sections": [
            {
            "title": "1. Objet et description du produit",
            "section": [
                "Les présentes CGV régissent la vente de la carte dématérialisée par Pace'sport, offrant à l'acheteur (ci-après dénommé vous ou l'acheteur) un accès aux avantages et promotions proposés par les enseignes partenaires pendant une durée d'un an à compter de la date d'achat.\n\n1.2 Description du produit : La carte dématérialisée permet à l'acheteur de bénéficier de réductions, promotions et offres spéciales auprès des enseignes locales partenaires de Pace'sport."
            ]
            },
            {
            "title": "2. Processus d'achat",
            "section": [
                "2.1 Commande : L'achat de la carte dématérialisée peut être effectué via l'application mobile Pace'sport. Vous devez fournir les informations requises, y compris les coordonnées de facturation et tout autre détail nécessaire pour le traitement de votre commande.",
                "2.2 Prix : Le prix de la carte dématérialisée est indiqué dans l'application au moment de l'achat. Tous les prix sont en euros et incluent les taxes applicables, sauf indication contraire.",
                "2.3 Paiement : Le paiement de la carte dématérialisée s'effectue selon les modalités proposées dans l'application, telles que le paiement par carte de crédit, par PayPal ou tout autre moyen de paiement accepté par Pace'sport.",
                "2.4 Confirmation : Une fois votre commande passée et votre paiement effectué avec succès, vous recevrez une confirmation de commande par e-mail ou dans l'application, récapitulant les détails de votre achat.",
            ]
            },
            {
            "title": "3. Durée et validité de la carte dématérialisée",
            "section": [
                "3.1 La carte dématérialisée est valable pour une durée d'un an à compter de la date d'achat, sauf indication contraire. Pendant cette période, vous pouvez bénéficier des avantages et promotions proposés par les enseignes partenaires de Pace'sport.",
                "3.2 À l'expiration de la période de validité, la carte dématérialisée ne pourra plus être utilisée pour obtenir des réductions ou avantages."
            ]
            },
            {
            "title": "4. Responsabilités et limitations",
            "section": [
                "4.1 Utilisation de la carte dématérialisée : Vous êtes responsable de l'utilisation de votre carte dématérialisée et vous vous engagez à l'utiliser conformément aux conditions et restrictions définies par Pace'sport et ses partenaires.\n\n",
                "4.2 Limitation de responsabilité : Pace'sport ne peut garantir la disponibilité, l'exactitude, l'exhaustivité ou la qualité des promotions et offres proposées par les enseignes partenaires. En aucun cas, Pace'sport ne pourra être tenu responsable des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation de la carte dématérialisée ou de l'impossibilité de l'utiliser."
                ]
            },
            {
            "title": "5. Droit de rétractation",
            "section": [
                "5.1 Conformément à la législation en vigueur, vous disposez d'un délai de rétractation de 14 jours à compter de la date d'achat pour annuler votre commande de la carte dématérialisée et obtenir un remboursement intégral. Toutefois, si vous avez utilisé la carte dématérialisée pendant la période de rétractation, vous ne serez pas éligible à un remboursement."
                ]
            },
            {
            "title": "6. Protection des données",
            "section": [
                "6.1 Les informations personnelles fournies lors de l'achat de la carte dématérialisée sont traitées conformément à notre politique de confidentialité, disponible dans l'application Pace'sport."
                ]
            },
            {
            "title": "7. Modification des CGV",
            "section": [
                "7.1 Nous nous réservons le droit de modifier les présentes CGV à tout moment, à notre seule discrétion. Les modifications prendront effet dès leur publication dans l'application Pace'sport. Il vous incombe de consulter régulièrement les CGV pour prendre connaissance des éventuelles modifications. En continuant à utiliser la carte dématérialisée après la publication des modifications, vous acceptez les CGV révisées."
                ]
            },
            {
            "title": "8. Contact",
            "section": [
                "8.1 Si vous avez des questions, des commentaires ou des préoccupations concernant les CGV, veuillez nous contacter à l'adresse suivante : contact@pacesport.fr."
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
        <Center className='tw-absolute tw-left-2 tw-top-0.5'>
        <Link href="/parametres">
        <Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button></Link>
              </Center>
            <BackgroundImage className="tw-h-full tw-opacity-10 tw-absolute tw-top-0 -tw-z-10" src='/doodle-pattern.png' />
            <Container p={'lg'}>
                <Center>
                    <Image src={'/logo.png'} width={80} alt="Logo Pace'sport" 
                            className='tw-rounded-full shadow-sm tw-bg-white tw-p-2 tw-m-4'/>
                </Center>
                {render}
            </Container>
        </main>
    </>
}