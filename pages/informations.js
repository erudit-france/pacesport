import { BackgroundImage, Box, Center, Container, Image, Text, Title, Button, TextInput, Space } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";
import Head from "next/head";
import Link from 'next/link';
import { getUser, getUsers } from "@/domain/repository/UserRepository";


export default function ConditionsGeneralesVente(props) {

    return <>
        <main className="tw-h-screen tw-rounded-t-2xl">
        <Center className='tw-absolute tw-left-2 tw-top-0.5'>
        <Link href="/parametres">
                        <Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button>
                </Link>
              </Center>
            <BackgroundImage className="tw-h-full tw-opacity-10 tw-absolute tw-top-0 -tw-z-10" src='/doodle-pattern.png' />
            <Container p={'lg'}>
                <Center>
                    <Image src={'/logo.png'} width={80} alt="Logo Pace'sport" 
                            className='tw-rounded-full shadow-sm tw-bg-white tw-p-2 tw-m-4'/>
                </Center>
            </Container>

            <TextInput readOnly description="Nom" value={props.user?.nom}/>
                <Space h={'md'} />
                <TextInput readOnly description="Prénom" value={props.user?.prenom}/>
                <Space h={'md'} />
                <TextInput readOnly description="Téléphone" value={props.user?.telephone}/>
                <Space h={'md'} />
                <TextInput readOnly description="Email" value={props.user?.email}/>
        </main>
        <script dangerouslySetInnerHTML={{ __html: `
        function redirectToExample() {
               window.location.href = 'https://www.example.com'
        }
        `}} />
    </>
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let user = await getUser(token)

// // Pass data to the page via props
return { props: {
    user: JSON.parse(user.data)
}}}