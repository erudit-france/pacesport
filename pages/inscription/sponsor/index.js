import { Avatar, Button, FileButton, FileInput, Flex, Group, Input, Paper, Radio, Select, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Head from "next/head";
import { useState } from "react";
import Layout from "../layout";

export default function Page() {
    const [logo, setLogo] = useState(null);
    const [logoError, setLogoError] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [type, setType] = useState(null);

    const handleLogo = (file) => {
        const url = URL.createObjectURL(file)
        setLogo(url)
        form.values.logo = file
        setLogoError(null)
    }
    const form = useForm({
        initialValues: {
            name: '',
            address: '',
            email: '',
            phone: '',
            description: '',
        },
        validate: {
            name: (v) => v > '' ? null : 'Veuillez saisir une dénomination',
            address: (v) => v > '' ? null : 'Veuillez saisir une adresse',
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail valide'),
            phone: (v) => v > '' ? null : 'Veuillez saisir un numéro',
            description: (v) => v > '' ? null : 'Veuillez saisir une description'
        },
    });

    const submitHandler = (data) => {
        setLogoError(null)
        if (logo == null) {
            setLogoError('Veuillez insérer un logo')
            return
        }
        console.log('data', data)
    }

    const TypeEnseigne = () => {
        return (
            <Select className="tw-m-1.5 tw-my-3" value={type} onChange={setType} description="Type enseigne" placeholder="Type enseigne"
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

    const TypeCollectivite = () => {
        return (
            <Select className="tw-m-1.5 tw-my-3" value={type} onChange={setType} description="Type collectivité" placeholder="Type collectivité"
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
        <title>Pace&#8217;sport - Inscription Partenaire</title>
      </Head>
      <form className="tw-relative tw-top-5" onSubmit={form.onSubmit((values) => submitHandler(values))}>
        <Text align="center" className="tw-font-semibold tw-text-lg tw-text-white">Formulaire Partenaire</Text>
        <Paper shadow="xl" p="xs" radius="lg" className="tw-bg-gray-800 tw-m-3 tw-pb-10 tw-top-5">
            <Radio.Group
                className="tw-text-white tw-p-2"
                name="isCollectivitePublique"
                defaultValue={"0"}
                withAsterisk
                >
                <Input.Label className="tw-text-white tw-top-[3px] tw-relative" required>Collectivité publique</Input.Label>
                <Group mt="xs">
                    <Radio checked={isPublic} onClick={() => {setIsPublic(true)}}
                            className="tw-text-white" value="1" label="Oui" />
                    <Radio checked={isPublic} onClick={() => {setIsPublic(false)}}
                            className="tw-text-white" value="0" label="Non" />
                </Group>
            </Radio.Group>
            {isPublic 
                ? <TypeEnseigne />
                : <TypeCollectivite />}
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
            <TextInput mt="sm" variant="filled" 
                description={isPublic == '1' ? 'Dénomination collectivité publique' : 'Dénomination sociale'} 
                placeholder={isPublic == '1' ? 'Dénomination collectivité publique' : 'Dénomination sociale'} 
                radius="lg" size="sm" withAsterisk
                {...form.getInputProps('name')}/>
            <TextInput mt="sm" variant="filled" description="Adresse" placeholder="Adresse" radius="lg" size="sm" withAsterisk
                {...form.getInputProps('address')}/>
            <TextInput mt="sm" variant="filled" description="E-mail" placeholder="E-mail" radius="lg" size="sm" withAsterisk
                {...form.getInputProps('email')}/>
            <TextInput mt="sm" variant="filled" description="Téléphone" placeholder="Téléphone" radius="lg" size="sm" withAsterisk
                {...form.getInputProps('phone')}/>
            <Textarea mt="sm" variant="filled" 
                description={isPublic ? 'Description de la collectivité' : 'Description du partenaire'} 
                placeholder={isPublic ? 'Description de la collectivité' : 'Description du partenaire'} 
                radius="lg" size="sm" withAsterisk
                {...form.getInputProps('description')}/>
            <Flex className="tw-border-[1px] tw-border-gray-800 tw-bg-gray-900 tw-rounded-md tw-my-2 tw-py-2" direction={"column"}>
                <Text align="center" className="tw-text-gray-300 tw-text-sm">Justificatifs</Text>
                <FileInput className="tw-text-white placeholder:tw-text-white tw-bg-gray-100 tw-rounded-md" placeholder="Justificatif 1" size="sm" m={'xs'} withAsterisk/>
                <FileInput className="tw-text-white placeholder:tw-text-white tw-bg-gray-100 tw-rounded-md" placeholder="Justificatif 2" size="sm" m={'xs'} withAsterisk/>
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
