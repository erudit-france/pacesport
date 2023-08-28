import { BackgroundImage, Box, Center, Container, Image, Text, Title, Button, TextInput, Space } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";
import Head from "next/head";
import { getActive } from "@/domain/repository/SponsorRepository";
import Link from 'next/link';
import { getUser, getUsers } from "@/domain/repository/UserRepository";


export default function ConditionsGeneralesVente(props) {
    console.log(props)
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

            <TextInput readOnly description="Pseudo" value={props.user?.pseudo}/>
                <Space h={'md'} />
                <TextInput readOnly description="Nom" value={props.user?.nom}/>
                <Space h={'md'} />
                <TextInput readOnly description="Prénom" value={props.user?.prenom}/>
                <Space h={'md'} />
                <TextInput readOnly description="Téléphone" value={props.user?.telephone}/>
                <Space h={'md'} />
                <TextInput readOnly description="Email" value={props.user?.email}/>

                {props.user?.enseigne?.name && (
                <>
                <Space h={'md'} />
                <Center><Text className="tw-mt-8">Enseigne</Text></Center>
                <Space h={'md'} />
                    <TextInput readOnly description="Nom" value={props.user?.enseigne?.name} />
                    <Space h={'md'} />
                    <TextInput readOnly description="Adresse" value={props.user?.enseigne?.address} />
                    <Space h={'md'} />
                    <TextInput readOnly description="Téléphone" value={props.user?.enseigne?.phone} />
                    <Space h={'md'} />
                    <TextInput readOnly description="Email" value={props.user?.enseigne?.email} />
                    <Space h={'md'} />
                    <TextInput readOnly description="Type" value={props.user?.enseigne?.type} />
                </>
                
            )}

                {props?.user?.association?.name && (
                <>
                <Space h={'md'} />
                <Center><Text className="tw-mt-8">Association</Text></Center>
                <Space h={'md'} />
                    <TextInput readOnly description="Nom" value={props.user?.association?.name} />
                    <Space h={'md'} />
                    <TextInput readOnly description="Description" value={props.user?.association?.description} />
                    <Space h={'md'} />
                    <TextInput readOnly description="Téléphone" value={props.user?.association?.phone} />
                    <Space h={'md'} />
                    <TextInput readOnly description="Email" value={props.user?.association?.email} />
                    <Space h={'md'} />
                    <TextInput readOnly description="Adresse" value={props.user?.association?.address} />
                    <Space h={'md'} />
                    <TextInput readOnly description="Code postal" value={props.user?.association?.postal} />
                    <Space h={'md'} className="tw-mb-8"/>
                    <br className="tw-mb-8"></br>
                </>
            )}
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
return { props: {
    user: JSON.parse(user.data),
    //association: JSON.parse(data.data),
    sponsors: JSON.parse(sponsors.data)
}}}