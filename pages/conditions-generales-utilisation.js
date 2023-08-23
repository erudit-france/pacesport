import { BackgroundImage, Box, Center, Container, Image, Text, Title, Button } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";
import Head from "next/head";
import Link from 'next/link';


export default function ConditionsGeneralesVente() {
    const json = {
        
        "page": "Conditions générales d'utilisation (CGU) | Pacesport",
        "title": "Conditions générales d'utilisation (CGU) de Pace'sport",
        "sub": "Date d'entrée en vigueur : 13/07/2023",
        "section": "En utilisant l'Application Pace'sport, vous reconnaissez avoir lu, compris et accepté les présentes CGU. Si vous n'acceptez pas les CGU, vous ne devez pas utiliser l'Application.",
        "pre": "Les présentes conditions générales d'utilisation (ci-après dénommées \"CGU\") régissent l'utilisation de l'application mobile Pace'sport (ci-après dénommée \"l'Application\") et les relations entre l'utilisateur de l'Application (ci-après dénommé \"l'Utilisateur\" ou \"vous\") et Pace'sport (ci-après dénommée \"nous\" ou \"notre\"), l'exploitant de l'Application. En utilisant l'Application, vous acceptez pleinement et sans réserve les présentes CGU.",
        "sections": [
            {
            "title": "1. Acceptation des CGU",
            "section": [
                "En utilisant l'Application Pace'sport, vous reconnaissez avoir lu, compris et accepté les présentes CGU. Si vous n'acceptez pas les CGU, vous ne devez pas utiliser l'Application."
                ]
            },
            {
            "title": "2. Utilisation de l'Application",
            "section": [
                "2.1 Inscription : Pour utiliser certaines fonctionnalités de l'Application, vous devrez créer un compte et fournir des informations précises et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion et vous ne devez pas les partager avec des tiers. Vous êtes entièrement responsable de toutes les activités effectuées sous votre compte.\n\n",
                "2.2 Utilisation licite : Vous vous engagez à utiliser l'Application conformément aux lois et réglementations applicables. Vous ne devez pas utiliser l'Application à des fins illicites, frauduleuses, diffamatoires, obscènes ou offensantes, ni pour porter atteinte aux droits de tiers.\n\n",
                "2.3 Contenu de l'Utilisateur : Lorsque vous publiez du contenu sur l'Application, vous garantissez détenir tous les droits nécessaires sur ce contenu. Vous accordez à Pace'sport une licence mondiale, non exclusive, libre de redevance, transférable et pouvant faire l'objet de sous-licences pour utiliser, reproduire, modifier, adapter, publier, traduire, distribuer et afficher ce contenu dans le cadre de l'exploitation de l'Application.\n\n",
                "2.4 Propriété intellectuelle : Tous les droits de propriété intellectuelle liés à l'Application, y compris les droits sur le contenu, les marques commerciales et les droits d'auteur, sont la propriété exclusive de Pace'sport. Vous ne devez pas copier, modifier, distribuer, reproduire, republier, télécharger, afficher ou transmettre tout contenu de l'Application sans autorisation écrite préalable de Pace'sport."
                ]
            },
            {
            "title": "3. Responsabilités",
            "section": [
                "3.1 Limitation de responsabilité : L'Utilisateur utilise l'Application à ses propres risques. Pace'sport ne peut garantir la disponibilité continue, l'exactitude, l'exhaustivité ou la fiabilité de l'Application. Dans les limites autorisées par la loi, Pace'sport décline toute responsabilité pour les dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser l'Application.\n\n",
                "3.2 Modification de l'Application : Pace'sport se réserve le droit de modifier, suspendre ou interrompre, temporairement ou définitivement, tout ou partie de l'Application, sans préavis ni responsabilité envers l'Utilisateur."
                ]
            },
            {
            "title": "4. Confidentialité",
            "section": [
                "L'utilisation de vos informations personnelles par Pace'sport est régie par notre politique de confidentialité, disponible sur [lien vers la politique de confidentialité]."
                ]
            },
            {
            "title": "5. Modification des CGU",
            "section": [
                "Nous nous réservons le droit de modifier les présentes CGU à tout moment, à notre seule discrétion. Les modifications prendront effet dès leur publication dans l'Application. Il vous incombe de consulter régulièrement les CGU pour prendre connaissance des éventuelles modifications. En continuant à utiliser l'Application après la publication des modifications, vous acceptez les CGU révisées."
                ]
            },
            {
            "title": "6. Droit applicable et juridiction compétente",
            "section": [
                "Les présentes CGU sont régies et interprétées conformément aux lois françaises. Tout litige découlant de l'utilisation de l'Application sera soumis à la compétence exclusive des tribunaux français."
                ]
            },
            {
            "title": "7. Contact",
            "section": [
                "Si vous avez des questions, des commentaires ou des préoccupations concernant les CGU, veuillez nous contacter à l'adresse suivante : contact@pacesport.fr."
                ]
            },
            {
            "title": "8. Résiliation",
            "section": [
                "Vous pouvez résilier votre compte et mettre fin à votre utilisation de l'Application à tout moment, en suivant les procédures de résiliation disponibles dans l'Application. Pace'sport se réserve également le droit de résilier votre accès à l'Application, sans préavis, en cas de violation des présentes CGU ou de toute autre conduite inappropriée."
                ]
            },
            {
            "title": "9. Intégralité de l'accord",
            "section": [
                "Les présentes CGU constituent l'intégralité de l'accord entre vous et Pace'sport concernant votre utilisation de l'Application et remplacent tous les accords antérieurs ou contemporains, écrits ou verbaux, relatifs à ce sujet."
                ]
            },
            {
            "title": "10. Dispositions diverses",
            "section": [
                "Si l'une des dispositions des présentes CGU est jugée invalide ou inapplicable par une juridiction compétente, cela n'affectera en rien la validité et l'applicabilité des autres dispositions. Le fait pour Pace'sport de ne pas exercer un droit ou une disposition prévu par les présentes CGU ne constitue pas une renonciation à ce droit ou à cette disposition.\n\nNous vous encourageons à lire attentivement les présentes CGU et à les conserver pour référence future. Si vous avez des questions concernant les CGU, veuillez nous contacter à l'adresse indiquée ci-dessus.\n\nMerci d'utiliser l'application Pace'sport !"
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