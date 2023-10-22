import { ActionIcon, Box, Button, Flex, Image, Space, Text, Title, TextInput, Textarea } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { BsLock, BsArrowLeft } from 'react-icons/bs'
import Layout from "@/components/layout/GradientDoodle"
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import Toast from "@/services/Toast"
import { getCookie } from "cookies-next"
import { serialize } from "object-to-formdata"
import { FiArrowLeft, FiSettings } from "react-icons/fi";

export default function Page(props) {
    const router = useRouter()
    const context = useContext(AppContext)
    const logout = () => {
        deleteCookie('token_v2')
        router.push('/login')
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const form = useForm({
        initialValues: {
            name: props.user ? props.user.nom + " " + props.user.prenom : '',
            email: props.user ? props.user.email : '',
            message: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail'),
        },
    });

    const handleSubmit = (e) => {
        let body = serialize(e)
        console.log(e)
        fetch(`/api/mail/help`, {
            method: 'POST',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v2')}`
            }),
            body: body
        }).then(res => res.json())
            .then(res => {
                if (res.data) {
                    Toast.success('Mail envoyée')
                }
                close()
            })
            .catch((error) => {
                Toast.error('Erreur pendant l\'envoi du mail')
                close()
            })
    };

    return (
        <>
            <Head><title>Pace'sport - contacter</title></Head>

            <header>
                <Space my={'xl'} pt={'xl'} h={'xl'} />
            </header>
            <Box className="tw-rounded-3xl tw-relative" pt={'xl'} m={'lg'} bg={'dark'}>
                <Title order={6} align="center" transform="uppercase" weight={600} color="white">
                    Nous contacter
                </Title>
                <Link href="/login/as">
                    <Button variant="filled" size="sm"
                        className="tw-bg-gray-50 tw-ml-5 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full"
                        radius={'xl'}><BsArrowLeft /></Button></Link>
                <form onSubmit={(values) => handleSubmit(values)}>
                    <div className="p-2"> {/* Ajoute un padding aux côtés du formulaire */}
                        <TextInput size="xs" mb={'sm'} label={<span style={{ color: 'white' }}>Nom</span>} className="tw-ml-[20px] tw-mr-[20px] tw-text-white"
                            withAsterisk
                            {...form.getInputProps('name')} />
                        <TextInput size="xs" mb={'sm'} label={<span style={{ color: 'white' }}>Email</span>} className="tw-ml-[20px] tw-mr-[20px]"
                            withAsterisk
                            {...form.getInputProps('email')} />
                        <Textarea size="xs" mb={'xl'} label={<span style={{ color: 'white' }}>Messsage</span>} className="tw-ml-[20px] tw-mr-[20px]"
                            autosize
                            withAsterisk
                            {...form.getInputProps('message')} />
                        <Button className="tw-w-full tw-mx-auto tw-bg-teal-600 hover:tw-bg-teal-700"
                            mt={'md'} radius={'lg'} size="sm" variant="filled"
                            type="submit">Envoyer</Button>
                    </div>
                </form>
            </Box>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token_v2']
    const res = await fetch(`${process.env.API_URL}/api/account/is-signup-complete`, {
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

    const user = await fetch(`${process.env.API_URL}/api/user`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    })
    const userData = await user.json();
    // // Pass data to the page via props
    return {
        props: {
            status: data.data,
            user: JSON.parse(userData.data)
        }
    }
}

Page.getLayout = function getLayout(page) {
    return (
        <Layout isLogoVisible={false}>{page}</Layout>
    )
}