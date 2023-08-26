import { SiMaildotru } from 'react-icons/si'
import { Alert, Button, Flex, Input, Paper, PasswordInput, Text, TextInput, Modal, Title, Box, emailForm, Center, Loader } from "@mantine/core";
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { setCookie, getCookie } from 'cookies-next';
import { useContext } from 'react';
import { serialize } from "object-to-formdata";
import { AppContext } from '@/context/AppContext';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import Toast from "@/services/Toast";

export default function LoginForm({ loading }) {
  const context = useContext(AppContext)
  const [loading2, setLoading] = useState(false)
  const [openInvitationModal, { open, close }] = useDisclosure(false);
  const inputOptions = {
    mt: "sm",
    variant: "filled",
    placeholder: "Prénom",
    radius: "lg",
    size: "md"
  }
  const router = useRouter();
  const [error, setError] = useState('');
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: true
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail valide'),
      password: (v) => v > '' ? null : 'Veuillez saisir un mot de passe'
    },
  });

  const emailForm = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail'),
    },
  });

  const emailSubmitHandler = (values) => {
    setLoading(true);
    console.log(values.email);

    fetch(`/api/mail/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ici, on définit le type de contenu comme JSON
      },
      body: JSON.stringify({ email: values.email })  // On envoie l'email en tant que JSON
    })
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          Toast.success('Mail envoyé');
          console.log(res.data);
        }
        setLoading(false);
        close();
      })
      .catch((error) => {
        Toast.error('Erreur pendant l\'envoi du mail');
        console.log('Erreur');
        console.log(error);
        setLoading(false);
        close();
      });
  };


  const submitHandler = (data) => {
    loading(true)
    setError('')

    fetch(`/api/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(res => {
        loading(false)
        if (res.payload) {
          if (res.payload.token) {
            setCookie('token', res.payload.token)
            nextPage()
          }
        }
        if (res.code == 401) { setError(res.message) }
      })
      .catch((error) => {
        loading(false)
        setError(`Erreur de connexion à la base de données \n ${error.message}`)
      });
  }

  const nextPage = () => { router.push('/login/as') }

  return (
    <>
      <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
        {/* <form onSubmit={(e) => nextPage(e)}> */}
        <Paper className='tw-bg-gray-900 tw-rounded-t-none tw-border-[1px] tw-border-white tw-border-t-0' shadow="xl" p="md" radius="lg">
          <TextInput {...inputOptions} placeholder="Adresse mail" {...form.getInputProps('email')}
            icon={<SiMaildotru className="tw-text-black tw-relative" />} />
          <PasswordInput {...inputOptions} placeholder="Mot de passe" {...form.getInputProps('password')} />
          {/* <Link href=''><Text color='dimmed' fz={'sm'} m={"xs"} className='hover:tw-text-gray-400'>Mot de passe oublié?</Text></Link> */}
          <Button size="xs"
            onClick={() => open(true)}
            className="hover:tw-text-gray-400">
            Mot de passe oublié?</Button>
          {error != '' &&
            <Alert icon={<AiOutlineInfoCircle size="1rem" />} p={'md'} mt='md' color="pink" radius="md" withCloseButton onClose={() => setError('')}>
              <span className='tw-text-[#d61515]'>{error}</span></Alert>
          }
          <Flex align="center" mt="sm">
            <input
              type="checkbox"
              id="rememberMe"
              className="tw-mr-xs tw-hidden"
              {...form.getInputProps('rememberMe')}
            />
            <label
              htmlFor="rememberMe"
              className="tw-flex tw-items-center tw-cursor-pointer"
            >
              <div className="tw-w-6 tw-h-6 tw-rounded-md tw-border tw-border-gray-400 tw-bg-transparent tw-mr-2 tw-flex tw-items-center tw-justify-center">
                {form.values.rememberMe && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-h-12 tw-w-12 tw-text-[#d61515] tw-fill-current"
                    viewBox="0 0 15 15"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.797 10.743a.666.666 0 01-.943.942L4.417 9.096a.666.666 0 11.943-.943l1.437 1.44 4.518-4.517a.666.666 0 11.943.943l-5.217 5.217z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="tw-text-gray-100 tw-text-xs">Se souvenir de moi</span>
            </label>
          </Flex>

        </Paper>

        <Flex className='' justify="center" align="center" direction="row" mt="md">
          <div className='tw-w-1/2'>
            <Button
              className="tw-bg-gray-900 hover:tw-bg-gray-600 tw-shadow-sm tw-border-[1px] tw-border-gray-400"
              size='md'
              fullWidth
              radius="xl"
              type='submit'>Connexion</Button>
          </div>
        </Flex>
      </form>

      <Modal radius={'lg'} className="" opened={openInvitationModal} onClose={close} centered
        title={<Title className="tw-mx-auto" transform="uppercase" align="center" order={6}>Entrez votre email pour la récupération du mot de passe</Title>}>
        <Box align='' mt={'md'} p={'xs'}>
          <form onSubmit={emailForm.onSubmit((values) => emailSubmitHandler(values))} className="tw-my-4">
            <TextInput mt="sm" variant="filled" className="" description="E-mail" placeholder="E-mail" radius="md" size="sm" withAsterisk
              {...emailForm.getInputProps('email')} />

            <Center>
              <Button type="submit" size="xs"
                disabled={loading2}
                className="tw-bg-[#d61515] tw-text-gray-100 tw-text-xs tw-rounded-3xl tw-px-10 tw-h-8 tw-mt-8 tw-shadow-md
                                    hover:tw-bg-[#d61515]">
                {loading2 ? <Loader color="orange" size="xs" /> : ' Envoyer'}</Button>
            </Center>
          </form>
        </Box>
      </Modal>
    </>
  );
}
