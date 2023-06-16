import { SiMaildotru } from 'react-icons/si'
import { Alert, Button, Flex, Input, Paper, PasswordInput, Text, TextInput } from "@mantine/core";
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { useState } from 'react';
import { setCookie, getCookie } from 'cookies-next';
import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function LoginForm({loading}) {
  const context = useContext(AppContext)
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
        password: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail valide'),
      password: (v) => v > '' ? null : 'Veuillez saisir un mot de passe'
    },
});

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
      .then(res => 
        {
          loading(false)
          if (res.payload) {
            if(res.payload.token) {
              setCookie('token', res.payload.token)
            }
          }
          if (res.code == 401) {setError(res.message)}
          nextPage()
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
          <PasswordInput {...inputOptions} placeholder="Mot de passe" {...form.getInputProps('password')}/>
          <Link href=''><Text color='dimmed' fz={'sm'} m={"xs"} className='hover:tw-text-gray-400'>Mot de passe oublié?</Text></Link>
          {error != '' && 
              <Alert icon={<AiOutlineInfoCircle size="1rem" />} p={'md'} mt='md' color="pink" radius="md" withCloseButton onClose={() => setError('')}>
                <span className='tw-text-red-900'>{error}</span></Alert>
          }
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
    </>
  );
}
