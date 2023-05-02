import { SiMaildotru } from 'react-icons/si'
import { Alert, Button, Checkbox, Flex, Input, Paper, PasswordInput, Text, TextInput } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { useForm } from '@mantine/form';
import { AiOutlineInfoCircle } from 'react-icons/ai';

export default function SignupForm({loading}) {
  const inputOptions = {
    mt: "sm",
    variant: "filled",
    placeholder: "Prénom",
    radius: "lg",
    size: "md"
  }
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setError('')
    setSuccess('')
    if (data === undefined) return
    loading(true)

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
          if(res.error) setError(res.error.message) 
          if(res.data) {
            setSuccess(res.data.message)
            form.reset()
          }
        })
  }

  return (
    <>
      <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
        <Paper className='tw-bg-gray-900 tw-rounded-t-none tw-border-[1px] tw-border-white tw-border-t-0' shadow="xl" p="md" radius="lg">
          <TextInput {...inputOptions} {...form.getInputProps('nom')} placeholder='Nom' />
          <TextInput {...inputOptions} {...form.getInputProps('prenom')} placeholder='Prénom' />
          {/* <Input
            mt="sm"
            variant="filled"
            placeholder="Pseudo"
            radius="lg"
            size="md"
          /> */}
          <TextInput {... inputOptions} {...form.getInputProps('email')} placeholder="Adresse mail"
            icon={<SiMaildotru className="tw-text-black tw-relative" />}
            />
          <PasswordInput {...inputOptions} {...form.getInputProps('password')} placeholder="Mot de passe" />
          <PasswordInput {...inputOptions} {...form.getInputProps('passwordConfirmation')} placeholder="Confirmation mot de passe"/>

          <Checkbox
            ml="xs"
            my="lg"
            color="dark"
            size="sm"
            error={ cguChecked === false ? 'Veuillez accepter les CGU' : '' }
            label={
              <Text color='white'>
                J&lsquo;accepte les{" "}
                <Link
                  className="tw-text-blue-400 tw-underline"
                  href="#"
                  target="_blank"
                >
                  CGU
                </Link>
              </Text>
            }
            {...form.getInputProps('cgu', { type: 'checkbox' })}
          />
          {error != '' && 
            <Alert icon={<AiOutlineInfoCircle size="1rem" />} p={'md'} mt='md' color="pink" radius="md" withCloseButton closeButtonLabel='fermer' onClose={() => setError('')}>
              <span className='tw-text-red-900'>{error}</span></Alert>
          }
          {success != '' && 
            <Alert icon={<AiOutlineInfoCircle size="1rem" />} p={'md'} mt='md' color="teal" radius="md" withCloseButton closeButtonLabel='fermer' onClose={() => setSuccess('')}>
              <span className='tw-text-teal-900'>{success}</span></Alert>
          }
        </Paper>
        <Flex className='' justify="center" align="center" direction="row" mt="md">
            <div className='tw-w-1/2'>
              <Button
                className="tw-bg-gray-900 hover:tw-bg-gray-600 tw-shadow-sm tw-border-[1px] tw-border-gray-400"
                size='md'
                fullWidth
                radius="xl"
                type='submit'
                onClick={() => submitHandler()}
              >
                Inscription
              </Button>
            </div>
        </Flex>

      </form>
    </>
  );
}
