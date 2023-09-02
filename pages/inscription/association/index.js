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
import { TbRuler2 } from "react-icons/tb";

export default function Page() {
  const { push } = useRouter()
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [statusFile, setStatusFile] = useState(null);
  const [logoError, setLogoError] = useState(null);
  let boooo = false
  const handleLogo = (file) => {
    const url = file == null ? "/uploads/chairs.png" : URL.createObjectURL(file)

    if (file != null) {
      setLogo(url)
      setLogoFile(file)
      form.values.logo = file
      setLogoError(null)
    }
    else {
      form.values.logo = "/uploads/chairs.png"
      boooo = true;
    }
  }

  const form = useForm({
    initialValues: {
      name: '',
      address: '',
      ville: '',
      postal: '',
      email: '',
      phone: '',
      description: '',
    },
    validate: {
      name: (v) => v > '' ? null : 'Veuillez saisir un nom d\'association',
      address: (v) => v > '' ? null : 'Veuillez saisir une adresse d\'association',
      ville: (v) => v > '' ? null : 'Veuillez saisir une ville',
      postal: (v) => v > '' ? null : 'Veuillez saisir un code postal',
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail d\'association valide'),
      phone: (v) => v > '' ? null : 'Veuillez saisir un numéro d\'association',
    },
  });

  const submitHandler = async (data) => {
    setLoading(true)
    const body = serialize(data)
    let logoFilename = null
    let statusFilename = null

    //
    // Upload logo
    //
    if (logoFile) {
      const formData = new FormData()
      formData.append('file', logoFile)
      let avatar = await fetch(`/api/file/upload`, {
        method: 'POST',
        type: 'cors',
        headers: new Headers({
          'JWTAuthorization': `Bearer ${getCookie('token')}`
        }),
        body: formData
      })
      avatar = await avatar.json()
      if (avatar.code == 401) {
        push('/login')
        return
      }
      if (avatar.data.code != 1) {
        Toast.error('Erreur pendant le téléchargment du logo')
      } else {
        logoFilename = avatar.data.filename
      }
    }
    else if (boooo == TbRuler2) {
      logoFilename = "/uploads/chairs.png"
    }
    //
    // Upload status
    //
    if (statusFile) {
      let statusForm = new FormData()
      statusForm.append('file', statusFile)
      let status = await fetch(`/api/file/upload`, {
        method: 'POST',
        type: 'cors',
        headers: new Headers({
          'JWTAuthorization': `Bearer ${getCookie('token')}`
        }),
        body: statusForm
      })
      status = await status.json()
      if (status.data.code != 1) {
        Toast.error('Erreur pendant le téléchargment du status')
      } else {
        statusFilename = status.data.filename
      }
    }
    else {
      Toast.error('Status obligatoire')
      setLoading(false);
      return
    }

    //
    // Continue signup request
    //
    if (statusFilename) body.append('status', statusFilename)

    if (logoFilename) body.append('avatar', logoFilename)
    console.log('error', body)
    fetch(`/api/association`, {
      method: 'POST',
      type: 'cors',
      headers: new Headers({
        'JWTAuthorization': `Bearer ${getCookie('token')}`
      }),
      body: body
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then(res => {
        if (res.data && res.data.code == 401) push('/login')
        console.log('res', res)
        if (res.data.code == 1) {
          Toast.success(res.data.message)
          setTimeout(() => {
            push('/profil/association')
          }, 2000)
        } else {
          Toast.error(res.data.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        Toast.error(`Erreur pendant la création de l'association`);
        setLoading(false);

        // Afficher le message d'erreur général
        console.log('Error Message:', error.message);

        // Afficher le détail de la réponse si elle est présente
        if (error.response) {
          console.log('Data:', error.response.data);
          console.log('Status:', error.response.status);
          console.log('Headers:', error.response.headers);
        } else {
          // Si error.response n'est pas défini, cela pourrait être un problème réseau
          console.log('Erreur réseau ou demande non terminée.');
        }
      });


  }

  return (
    <>
      <Head>
        <title>Pace'sport - Inscription Association</title>
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
            {logoError && <Text align="center" size={'xs'} className="tw-text-[#d61515]">{logoError}</Text>}
          </Flex>
          <TextInput mt="sm" variant="filled" description="Nom de l'association" placeholder="Nom de l'association" radius="lg" size="sm" withAsterisk
            {...form.getInputProps('name')} />
          <TextInput mt="sm" variant="filled" description="Code postal de l'association" placeholder="Code postal de l'association" radius="lg" size="sm" withAsterisk
            {...form.getInputProps('postal')} />
          <TextInput mt="sm" variant="filled" description="Ville de l'association" placeholder="Ville de l'association" radius="lg" size="sm" withAsterisk
            {...form.getInputProps('ville')} />
          <TextInput mt="sm" variant="filled" description="Adresse de l'association" placeholder="Adresse de l'association" radius="lg" size="sm" withAsterisk
            {...form.getInputProps('address')} />
          <TextInput mt="sm" variant="filled" description="E-mail de l'association" placeholder="E-mail de l'association" radius="lg" size="sm" withAsterisk
            {...form.getInputProps('email')} />
          <TextInput mt="sm" variant="filled" description="Téléphone de l'association" placeholder="Téléphone de l'association" radius="lg" size="sm" withAsterisk
            {...form.getInputProps('phone')} />
          <TextInput mt="sm" variant="filled" description="Description de l'association" placeholder="Description de l'association" radius="lg" size="sm" withAsterisk
            {...form.getInputProps('description')} />
          <Flex className="tw-border-[1px] tw-border-gray-800 tw-bg-gray-900 tw-rounded-md tw-my-2 tw-py-2" direction={"column"}>
            <Text align="center" className="tw-text-gray-300 tw-text-sm">Status de l'association</Text>
            <FileInput className="tw-text-white placeholder:tw-text-white tw-bg-gray-100 tw-rounded-md"
              onChange={setStatusFile}
              placeholder="Status" size="sm" m={'xs'} withAsterisk />
          </Flex>

        </Paper>

        <Flex justify="center" align="center" direction="row" mt="md">
          <Button className="tw-bg-gray-300 hover:tw-bg-gray-300/95 tw-text-gray-700 tw-shadow-sm -tw-top-10" radius="xl" size="md"
            type='submit'
            disabled={loading}>Terminer
          </Button>
        </Flex>
      </form>
    </>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
