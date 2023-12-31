import { Avatar, Button, FileButton, FileInput, Flex, Group, Input, Paper, Radio, Select, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { useRouter } from "next/router";
import { serialize } from "object-to-formdata";
import { useState } from "react";
import Layout from "../layout";
import Toast from "@/services/Toast";
import fileUploader from "@/utils/fileUploader";
import Link from 'next/link';
import { BsArrowLeft } from "react-icons/bs";

export default function Page(props) {
    const router = useRouter();
    const [logo, setLogo] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoError, setLogoError] = useState(null);
    const [isPublic, setIsPublic] = useState(props.isPublic);
    const [type, setType] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const { push } = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hideAddressAndVille, setHideAddressAndVille] = useState(false);

    const isPublicHandler = (v) => {
        setIsPublic(v)
        setType(null)
        form.values.type = ''
    }

    const typeHandler = (type) => {
        setType(type)
        form.values.type = type
    }

    const handleLogo = (file) => {
        setLogoFile(file)
        const url = URL.createObjectURL(file)
        setLogo(url)
        form.values.logo = file
        setLogoError(null)
    }
    const form = useForm({
        initialValues: {
            name: '',
            address: '',
            postal: '',
            ville: '',
            email: '',
            phone: '',
            description: '',
            isPublic: isPublic,
            longitude: '',
            latitude: ''
        },
        validate: {
            name: (v) => v > '' ? null : 'Veuillez saisir une dénomination',
            address: (v) => v > '' ? null : 'Veuillez saisir une adresse',
            postal: (v) => v > '' ? null : 'Veuillez saisir un code postal',
            ville: (v) => v > '' ? null : 'Veuillez saisir une ville',
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail valide'),
            phone: (v) => v > '' ? null : 'Veuillez saisir un numéro',
            // logo: () => { 
            //     setLogoError(null)
            //     if(logo == null){ setLogoError('Veuillez insérer un logo') }
            //     return logoError
            // },
            type: () => {
                setTypeError(null)
                if (type == null) { setTypeError('Veuillez choisir un type') }
                return typeError
            }
        },
    });

    const submitHandler = async (data) => {
        setIsSubmitting(true);
        let body = serialize(data)
        const formData = new FormData()
        formData.append('file', logoFile)
        fetch(`/api/file/upload`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
            }),
            body: formData
        })
            .then(res => res.json())
            .then(response => {

                body.append('filename', response.data.filename)
                fetch(`/api/enseigne`, {
                    method: 'POST',
                    type: 'cors',
                    headers: new Headers({
                        'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
                    }),
                    body: body
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.code == 401) push('/login')
                        console.log('res', res.data)
                        if (res.data.code == 1) {
                            Toast.success(res.data.message)
                            setTimeout(() => {
                                push('/profil/sponsor')
                            }, 2000)
                        } else {
                            Toast.error(res.data.message)
                            setIsSubmitting(false);
                        }
                    })
                    .catch((error) => {
                        Toast.error('Erreur pendant la création du sponsor')
                        console.log('error', error)
                        setIsSubmitting(false);
                    })
            })
            .catch((error) => {
                console.log('error', error)
                try {
                    fetch(`/api/enseigne`, {
                        method: 'POST',
                        type: 'cors',
                        headers: new Headers({
                            'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
                        }),
                        body: body
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (res.code == 401) push('/login')
                            console.log('res', res.data)
                            if (res.data.code == 1) {
                                Toast.success(res.data.message)
                                setTimeout(() => {
                                    push('/profil/sponsor')
                                }, 2000)
                            } else {
                                Toast.error(res.data.message)
                                setIsSubmitting(false);
                            }
                        })
                        .catch((error) => {
                            Toast.error('Erreur pendant la création du sponsor')
                            console.log('error', error)
                            setIsSubmitting(false);
                        })
                } catch (error) {
                    Toast.error('Erreur pendant le téléchargement de l\'image')
                    setIsSubmitting(false);
                }

            })
    }

    const TypeEnseigne = ({ error }) => {
        return (
            <Select className="tw-m-1.5 tw-my-3" value={type} onChange={typeHandler} description="Type enseigne" placeholder="Type enseigne"
                error={error}
                data={[
                    { value: 'Restauration', label: 'Restauration' },
                    { value: 'Services', label: 'Services' },
                    { value: 'Mode', label: 'Mode' },
                    { value: 'Bien-être', label: 'Bien-être' },
                    { value: 'Sport', label: 'Sport' },
                    { value: 'Technologie', label: 'Technologie' },
                    { value: 'Culture', label: 'Culture' },
                    { value: 'Divertissement', label: 'Divertissement' },
                    { value: 'Autre', label: 'Autre' }
                ]} />
        )
    }

    const handleSubmit = async (values) => {
        const address = values.address; // Assurez-vous que 'address' correspond au nom de votre champ d'adresse dans le formulaire
        const osmGeocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&street=${encodeURI(address)}&city=${encodeURI(values.ville)}&county=france&postalcode=${encodeURI(values.postal)}`;
        if (hideAddressAndVille) {
            values.latitude = '0';
            values.longitude = '0';
        }
        else {
            try {
                const response = await fetch(osmGeocodingUrl);
                const data = await response.json();

                if (data.length > 0) {
                    const { lat: offerLat, lon: offerLon } = data[0];
                    values.latitude = offerLat;
                    values.longitude = offerLon;
                }
            } catch (error) {
            }
        }
        submitHandler(values);
    };

    const TypeCollectivite = ({ error }) => {
        return (
            <Select className="tw-m-1.5 tw-my-3" value={type} onChange={typeHandler} description="Type collectivité" placeholder="Type collectivité"
                error={error}
                data={[
                    { value: 'Commune', label: 'Commune' },
                    { value: 'EPCI', label: 'EPCI' },
                    { value: 'Région', label: 'Région' },
                    { value: 'Département', label: 'Département' }
                ]} />
        )
    }
    return (
        <>
            <Head>
                <title>Pace'sport - Inscription Partenaire</title>
            </Head>
            <Link href="/login/as">
                <Button variant="filled" size="sm"
                    className="tw-bg-gray-50 tw-text-black tw-ml-5 tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full"
                    radius={'xl'}><BsArrowLeft /></Button></Link>
            <form className="tw-relative tw-top-5" onSubmit={form.onSubmit((handleSubmit))}>
                <Text align="center" className="tw-font-semibold tw-text-lg tw-text-white">Formulaire Partenaire</Text>
                <Paper shadow="xl" p="xs" radius="lg" className="tw-bg-gray-800 tw-m-3 tw-pb-10 tw-top-5">
                    {isPublic
                        ? <TypeCollectivite error={typeError} />
                        : <TypeEnseigne error={typeError} />}
                    <Flex className="tw-border-[1px] tw-border-gray-800 tw-bg-gray-900 tw-rounded-md mx-auto tw-m-1 tw-py-1"
                        align={'center'}
                        direction={"column"}>
                        <Text align="center" className="tw-text-gray-300 tw-text-sm">Logo</Text>
                        <FileButton className="tw-cursor-pointer tw-my-2 tw-shadow-sm tw-shadow-white" onChange={handleLogo}
                            accept="image/png,image/jpeg">
                            {(props) => <Avatar {...props} mt={'md'} radius="xl" src={logo ? logo : null} size={'lg'} />}
                        </FileButton>
                        {logoError && <Text align="center" size={'xs'} className="tw-text-[#d61515]">{logoError}</Text>}
                    </Flex>
                    <TextInput mt="sm" variant="filled"
                        description={isPublic == '1' ? 'Dénomination collectivité publique' : 'Dénomination sociale'}
                        placeholder={isPublic == '1' ? 'Dénomination collectivité publique' : 'Dénomination sociale'}
                        radius="lg" size="sm" withAsterisk
                        {...form.getInputProps('name')} />
                    <br />
                    <label className="tw-ml-2 tw-flex tw-items-center tw-cursor-pointer">
                        <input
                            type="checkbox"
                            className="tw-hidden"
                            checked={hideAddressAndVille}
                            onChange={() => setHideAddressAndVille(!hideAddressAndVille)}
                        />
                        <div className="tw-relative tw-w-14 tw-h-6 tw-bg-gray-400 tw-rounded-full tw-transition tw-duration-300 tw-ease-in-out">
                            <div
                                className={`tw-absolute tw-w-6 tw-h-6 tw-rounded-full tw-transition tw-duration-300 tw-ease-in-out ${hideAddressAndVille ? 'tw-translate-x-5 tw-bg-red-500' : ' tw-bg-white'}`}
                                style={{ left: hideAddressAndVille ? '0.75rem' : 'calc(100% - 3.50rem)' }}
                            ></div>
                        </div>
                        <span className="tw-ml-2 tw-text-white">Boutique en ligne</span>
                    </label>
                    <TextInput mt="sm" variant="filled" description="Code postal de l'enseigne" placeholder="Code postal de l'enseigne" radius="lg" size="sm" withAsterisk
                        {...form.getInputProps('postal')} />
                    <TextInput mt="sm" variant="filled" description="Ville de l'enseigne" placeholder="Ville de l'enseigne" radius="lg" size="sm" withAsterisk
                        {...form.getInputProps('ville')} />
                    <TextInput mt="sm" variant="filled" description="Adresse de l'enseigne" placeholder="Adresse de l'enseigne" radius="lg" size="sm" withAsterisk
                        {...form.getInputProps('address')} />
                    <TextInput mt="sm" variant="filled" description="E-mail de l'enseigne" placeholder="E-mail de l'enseigne" radius="lg" size="sm" withAsterisk
                        {...form.getInputProps('email')} />
                    <TextInput mt="sm" variant="filled" description="Téléphone de l'enseigne" placeholder="Téléphone de l'enseigne" radius="lg" size="sm" withAsterisk
                        {...form.getInputProps('phone')} />
                    <Textarea mt="sm" variant="filled"
                        description={isPublic ? 'Description de la collectivité' : 'Description/bio de votre activité'}
                        placeholder={isPublic ? 'Description de la collectivité' : 'Description/bio de votre activité'}
                        radius="lg" size="sm" withAsterisk
                        {...form.getInputProps('description')} />
                </Paper>

                <Flex justify="center" align="center" direction="row" mt="md">
                    <Button
                        className="tw-bg-gray-300 hover:tw-bg-gray-300/95 tw-text-gray-700 tw-shadow-sm -tw-top-10"
                        radius="xl" size="md" type='submit'
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Envoi en cours...' : 'Terminer'}
                    </Button>

                </Flex>
            </form>
        </>
    );
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token_v3']
    const res = await fetch(`${process.env.API_URL}/api/user/`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    const data = await res.json()

    if (data.code == 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }

    // // Pass data to the page via props
    return {
        props: {
            isPublic: JSON.parse(data.data).isCollectivitePublique,
        }
    }
}

Page.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
