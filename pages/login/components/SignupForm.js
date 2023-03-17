import { SiMaildotru } from 'react-icons/si'
import { Alert, Button, Checkbox, Flex, Input, Paper, PasswordInput, TextInput } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { useForm } from '@mantine/form';
import { AiOutlineInfoCircle } from 'react-icons/ai';

export default function SignupForm({loading}) {
  const [error, setError] = useState('');
  const [cguChecked, setCguChecked] = useState('');
  const form = useForm({
    initialValues: {
        nom: 'toto',
        prenom: 'toto',
        email: 'toto@example.com',
        password: '123',
        passwordConfirmation: '1234',
        cgu: false,
    },
    validate: {
      nom: (v) => v != '' ? null : 'Veuillez saisir un nom',
      prenom: (v) => v != '' ? null : 'Veuillez saisir un prénom',
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Veuillez saisir un E-mail valide'),
      password: (v) => v > '' ? null : 'Veuillez saisir un mot de passe',
      passwordConfirmation: (v) => v != '' 
        ? v === form.values.password 
           ? null
           : 'Les deux mots de passes ne correspondent pas'
        : 'Veuillez saisir un mot de passe',
      cgu: (v) => {
        if (v === true) {
          setCguChecked(true);
          return null
        }
        setCguChecked(false)
        return 'error'
      }
    },
  });

    
  const submitHandler = (data) => {
    if (data === undefined) return
    console.log('form.validate()', form.validate())
    loading(true)
    setError('')

    fetch(`/api/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(res => 
        {
          console.log('res', res)
          loading(false)
          // if (res.payload) {
          //   if(res.payload.token) setCookie('token', res.payload.token)
          // }
          // if (res.code == 401) {setError(res.message)}
          // nextPage()
        })
  }

  return (
    <>
      <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
        <Paper shadow="xl" p="md" radius="lg">
          <TextInput
            variant="filled"
            placeholder="Nom"
            radius="lg"
            size="md"
            withAsterisk
            {...form.getInputProps('nom')}
            />
          <TextInput
            mt="sm"
            variant="filled"
            placeholder="Prénom"
            radius="lg"
            size="md"
            {...form.getInputProps('prenom')}
            />
          {/* <Input
            mt="sm"
            variant="filled"
            placeholder="Pseudo"
            radius="lg"
            size="md"
          /> */}
          <TextInput
            mt="sm"
            icon={<SiMaildotru className="tw-text-black tw-relative" />}
            variant="filled"
            placeholder="Adresse mail"
            radius="lg"
            size="md"
            {...form.getInputProps('email')}
            />

          <PasswordInput
            mt="sm"
            placeholder="Mot de passe"
            variant="filled"
            radius="lg"
            size="md"
            {...form.getInputProps('password')}
            />

          <PasswordInput
            mt="sm"
            placeholder="Confirmation mot de passe"
            variant="filled"
            radius="lg"
            size="md"
            {...form.getInputProps('passwordConfirmation')}
            />

          <Checkbox
            ml="xs"
            my="lg"
            color="dark"
            size="sm"
            error={ cguChecked === false ? 'Veuillez accepter les CGU' : '' }
            label={
              <>
                J&lsquo;accepte les{" "}
                <Link
                  className="tw-text-blue-900 tw-underline"
                  href="#"
                  target="_blank"
                >
                  CGU
                </Link>
              </>
            }
            {...form.getInputProps('cgu', { type: 'checkbox' })}
          />
        </Paper>
        {error != '' && 
          <Alert icon={<AiOutlineInfoCircle size="1rem" />} p={'md'} mt='md' color="pink" radius="md" withCloseButton>
            <span className='tw-text-red-900'>{error}</span></Alert>
        }

        <Flex justify="center" align="center" direction="row" mt="md">
          <Button
            onClick={() => submitHandler()}
            className="tw-bg-pink-600 hover:tw-bg-pink-700 tw-shadow-sm"
            radius="xl"
            size="lg"
            type='submit'
          >
            Inscription
          </Button>
        </Flex>
      </form>
    </>
  );
}
