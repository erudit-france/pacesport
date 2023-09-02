import { BackgroundImage, Box, Center, Container, Image, Text, Title, Button, TextInput, Space } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";
import Head from "next/head";
import { getActive } from "@/domain/repository/SponsorRepository";
import Link from 'next/link';
import { getUser, getUsers } from "@/domain/repository/UserRepository";
import styles from '../styles/ConditionsGeneralesVente.module.css';
import { useState } from 'react';
import Toast from "@/services/Toast"

export default function ConditionsGeneralesVente(props) {
    const [isEditable, setIsEditable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        nom: props.user?.nom || '',
        prenom: props.user?.prenom || '',
        telephone: props.user?.telephone || '',
        email: props.user?.email || '',
        age: props.user?.age || '',
        sexe: props.user?.sexe || '',
        adresse: props.user?.adresse || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdate = () => {
        setIsLoading(true); // Définir isLoading à vrai

        // Obtenir le token à partir des cookies
        const token = getCookie('token');

        // Appeler la route Symfony pour mettre à jour l'utilisateur
        fetch(`/api/updateUser/${props.user?.id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'JWTAuthorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    Toast.success('Mise à jour réussie');
                } else {
                    console.log(res);
                    Toast.error('Échec de la mise à jour');
                }
            })
            .catch((error) => {
                Toast.error('Une erreur est survenue lors de la communication avec le serveur.');
            })
            .finally(() => {
                setIsLoading(false); // Rétablir isLoading à faux
            });
    };


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
                    {Object.keys(formData).map((key) => (
                        <InfoField
                            key={key}
                            description={key}
                            value={formData[key]}
                            isEditable={true}
                            onChange={handleChange}
                        />
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        onClick={handleUpdate}
                        style={{ backgroundColor: 'blue', color: 'white' }}
                        disabled={isLoading}  // Désactiver le bouton si isLoading est vrai
                    >
                        Mettre à jour
                    </Button>
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
const InfoField = ({ description, value, isEditable, onChange }) => {
    if (isEditable) {
        return (
            <>
                <TextInput
                    description={description}
                    name={description.toLowerCase()}
                    value={value}
                    onChange={onChange}
                />
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
                if (key === 'avatar' || key === 'backgroundImage' || key === 'status' || key === 'logo') {
                    var namePicture = "";
                    try {
                        namePicture = data[key]['name'];
                    } catch (error) {

                    }
                    return (
                        <div key={index}>
                            <Image src={"../public/uploads/" + namePicture} alt={key} width={50} height={50} />
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
    console.log(user);
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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
