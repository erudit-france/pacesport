import { BackgroundImage, Box, Center, Container, Image, Text, Title, Button, TextInput, Space } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";
import Head from "next/head";
import { getActive } from "@/domain/repository/SponsorRepository";
import Link from 'next/link';
import { getUser, getUsers } from "@/domain/repository/UserRepository";
import styles from '../styles/ConditionsGeneralesVente.module.css';


export default function ConditionsGeneralesVente(props) {
    return <>
        <main className={`tw-h-screen tw-rounded-t-2xl ${styles.userProfile}`}>
            <Center className='tw-absolute tw-left-2 tw-top-0.5'>
                <Link href="/parametres">
                    <Button variant="filled" size="sm"
                        className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900 hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full"
                        radius={'xl'}><BsArrowLeft /></Button>
                </Link>
            </Center>
            <BackgroundImage className="tw-h-full tw-opacity-10 tw-absolute tw-top-0 -tw-z-10" src='/doodle-pattern.png' />
            <Container p={'lg'}>
                <Center>
                    <Image src={'/logo.png'} width={80} alt="Logo Pace'sport"
                        className={`tw-rounded-full shadow-sm tw-bg-white tw-p-2 tw-m-4 ${styles.logo}`} />
                </Center>
            </Container>

            <div className={`tw-p-4 ${styles.infoContainer}`}>
                {/* User Info */}
                <div className={styles.infoGroup}>
                    <InfoField description="Nom" value={props.user?.nom} />
                    <InfoField description="Prénom" value={props.user?.prenom} />
                    <InfoField description="Téléphone" value={props.user?.telephone} />
                    <InfoField description="Email" value={props.user?.email} />
                    <InfoField description="âge" value={props.user?.age} />
                    <InfoField description="Sexe" value={props.user?.sexe} />
                    <InfoField description="Adresse" value={props.user?.adresse} />
                </div>

                {/* Enseigne Info */}
                {props.user?.enseigne?.name && (
                    <InfoSection title="Enseigne" data={props.user?.enseigne} />
                )}

                {/* Association Info */}
                {props?.user?.association?.name && (
                    <InfoSection title="Association" data={props.user?.association} />
                )}
            </div>
        </main>
        <script dangerouslySetInnerHTML={{
            __html: `
        function redirectToExample() {
               window.location.href = 'https://www.example.com'
        }
        `
        }} />
    </>
}
const InfoField = ({ description, value }) => {
    if (description === 'avatar' || description === 'backgroundImage' || description === 'status') {
        return (
            <>
                <Image src={value} alt={description} width={50} height={50} />
                <Space h={'md'} />
            </>
        );
    }
    return (
        <>
            <TextInput readOnly description={description} value={value} />
            <Space h={'md'} />
        </>
    );
};


const InfoSection = ({ title, data }) => (
    <>
        <Center><Text className={`tw-mt-8 ${styles.sectionTitle}`}>{title}</Text></Center>
        <div className={styles.infoGroup}>
            {Object.keys(data).map((key, index) => {
                // Ignorer l'affichage de l'identifiant
                if (key === 'id') return null;

                // Si la clé est 'avatar' ou 'bagWorld', affiche une image
                if (key === 'avatar' || key === 'backgroundImage' || key === 'status') {
                    return (
                        <div key={index}>
                            <Image src={data[key]} alt={key} width={50} height={50} />
                        </div>
                    );
                }
                return <InfoField key={index} description={key} value={data[key]} />;
            })}
        </div>
    </>
);



export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let user = await getUser(token)
    let sponsors = await getActive(token)

    // const res = await fetch(`${process.env.API_URL}/api/association/get/${id}`, {
    //     headers: new Headers({
    //             'JWTAuthorization': `Bearer ${token}`,
    //     })}
    //     )
    //  const data = await res.json()

    let cards = await fetch(`${process.env.API_URL}/api/discount-card`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    // // Pass data to the page via props
    return {
        props: {
            user: JSON.parse(user.data),
            //association: JSON.parse(data.data),
            sponsors: JSON.parse(sponsors.data)
        }
    }
}