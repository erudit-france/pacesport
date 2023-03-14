import { SiMaildotru } from 'react-icons/si'
import { Alert, Button, Flex, Input, Paper, PasswordInput, TextInput } from "@mantine/core";
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { useState } from 'react';

export default function LoginForm({overlayHandler}) {
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
          if (res.code == 401) {setError(res.message)}
          console.log(res)
        })
    // setTimeout(() => {
    //   overlayHandler(false)
    //   router.push('/profil')
    // }, 1000);
    // overlayHandler(true)
  }

  return (
    <>
      <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
        <Paper shadow="xl" p="md" radius="lg">
          <TextInput mt="sm" variant="filled" placeholder="Adresse mail" radius="lg" size="md"
            icon={<SiMaildotru className="tw-text-black tw-relative" />}
            withAsterisk
            {...form.getInputProps('email')}
          />
          <PasswordInput mt="sm" placeholder="Mot de passe" variant="filled" radius="lg" size="md"
            withAsterisk
            {...form.getInputProps('password')}
            />
            
          {error != '' && 
              <Alert icon={<AiOutlineInfoCircle size="1rem" />} p={'md'} mt='md' color="pink" radius="md" withCloseButton>
                <span className='tw-text-red-900'>{error}</span></Alert>
          }
        </Paper>

        <Flex justify="center" align="center" direction="row" mt="md">
          <Button className="tw-bg-pink-600 hover:tw-bg-pink-700 tw-shadow-sm" radius="xl" size="lg"
            type='submit'
            >
            Connexion
          </Button>
        </Flex>
      </form>
    </>
  );
}
