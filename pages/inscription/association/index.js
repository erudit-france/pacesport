import { Avatar, Button, FileButton, FileInput, Flex, Group, Paper, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { serialize } from "object-to-formdata";
import { useState } from "react";
import Layout from "../layout";
import fileUploader from "@/utils/fileUploader";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";

export default function Page() {
    const { push } = useRouter()
    const [logo, setLogo] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoError, setLogoError] = useState(null);
    const handleLogo = (file) => {
        const url = URL.createObjectURL(file)
        setLogo(url)
        setLogoFile(file)
        form.values.logo = file
        setLogoError(null)
    }
    const form = useForm({
        initialValues: {
            name: 'Lou',
            address: 'Lou 12 Lyon',
            email: 'lou@example.com',
            phone: '001239123023',
            description: 'Lou Rugby club',
            logo: null,
        },
        validate: {
            name: (v) => v > '' ? null : 'Veuillez saisir un nom',
            address: (v) => v > '' ? null : 'Veuillez saisir une adresse',
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail valide'),
            phone: (v) => v > '' ? null : 'Veuillez saisir un numéro',
            description: (v) => v > '' ? null : 'Veuillez saisir une description'
        },
    });

    const submitHandler = (data) => {
      const body = serialize(data)
      fileUploader(logoFile)
          .then((response) => {
              body.append('filename', response.data.filename)
              fetch(`/api/association`, {
                  method: 'POST',
                  type: 'cors',
                  headers: new Headers({
                    'JWTAuthorization': `Bearer ${getCookie('token')}`
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
                              push('/profil/association')
                          }, 2000)
                      } else {
                          Toast.error(res.data.message)
                      }
                  })
                  .catch((error) => { 
                      Toast.error(`Erreur pendant la création de l'association`) 
                      console.log('error', error)
                  })
      });
    }
  return (
    <>
      <Head>
        <title>Pace&#8217;sport - Inscription Association</title>
      </Head>
      <form className="tw-relative tw-top-5" onSubmit={form.onSubmit((values) => submitHandler(values))}>
        <Text align="center" className="tw-font-semibold tw-text-lg tw-text-white">Formulaire Association</Text>
        <Paper shadow="xl" p="xs" radius="lg" className="tw-bg-gray-800 tw-m-3 tw-pb-10 tw-top-5">
            <Flex className="tw-border-[1px] tw-border-gray-800 tw-bg-gray-900 tw-rounded-md mx-auto tw-m-1 tw-py-1"
                align={'center'}
                direction={"column"}>
                <Text align="center" className="tw-text-gray-300 tw-text-sm">Logo</Text>
                <FileButton className="tw-cursor-pointer tw-my-2 tw-shadow-sm tw-shadow-white" onChange={handleLogo}
                    accept="image/png,image/jpeg">
                    {(props) => <Avatar {...props} mt={'md'} radius="xl" src={logo ? logo : null} size={'lg'} />}
                </FileButton>
                {logoError && <Text align="center" size={'xs'} className="tw-text-red-600">{logoError}</Text>}
            </Flex>
            <TextInput mt="sm" variant="filled" description="Nom" placeholder="Nom" radius="lg" size="sm" withAsterisk
                {...form.getInputProps('name')}/>
            <TextInput mt="sm" variant="filled" description="Adresse" placeholder="Adresse" radius="lg" size="sm" withAsterisk
                {...form.getInputProps('address')}/>
            <TextInput mt="sm" variant="filled" description="E-mail" placeholder="E-mail" radius="lg" size="sm" withAsterisk
                {...form.getInputProps('email')}/>
            <TextInput mt="sm" variant="filled" description="Téléphone" placeholder="Téléphone" radius="lg" size="sm" withAsterisk
                {...form.getInputProps('phone')}/>
            <TextInput mt="sm" variant="filled" description="Description" placeholder="Description" radius="lg" size="sm" withAsterisk
                {...form.getInputProps('description')}/>
            <Flex className="tw-border-[1px] tw-border-gray-800 tw-bg-gray-900 tw-rounded-md tw-my-2 tw-py-2" direction={"column"}>
                <Text align="center" className="tw-text-gray-300 tw-text-sm">Status</Text>
                <FileInput className="tw-text-white placeholder:tw-text-white tw-bg-gray-100 tw-rounded-md" placeholder="Status" size="sm" m={'xs'} withAsterisk/>
            </Flex>

        </Paper>

        <Flex justify="center" align="center" direction="row" mt="md">
          <Button className="tw-bg-gray-300 hover:tw-bg-gray-300/95 tw-text-gray-700 tw-shadow-sm -tw-top-10" radius="xl" size="md"
            type='submit'>Terminer
          </Button>
        </Flex>
      </form>
    </>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
