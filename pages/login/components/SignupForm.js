import { SiMaildotru } from 'react-icons/si'
import { Alert, Button, Checkbox, Flex, Input, Paper, PasswordInput, Text, TextInput } from "@mantine/core";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from '@mantine/form';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BiLinkExternal } from 'react-icons/bi'
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
export default function SignupForm({ loading }) {
  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);
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
      nom: '',
      prenom: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      cgu: false,
      isCollectivitePublique: false,
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

  const onLoad = () => {
    // this reaches out to the hCaptcha JS API and runs the
    // execute function on it. you can use other functions as
    // documented here:
    // https://docs.hcaptcha.com/configuration#jsapi
    // captchaRef.current.execute();
  };

  useEffect(() => {
    if (token) {
    }
  }, [token]);

  const submitHandler = (data) => {
    // if (token == null) return
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
      .then(res => {
        console.log('res', res)
        loading(false)
        if (res.error) setError(res.error.message)
        if (res.data) {
          setSuccess(res.data.message)
          loading(true)

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
                  // Supprimer tous les cookies contenant le mot "token"
                  // deleteCookie('token_v3');

                  // Définir le nouveau cookie
                  const EXPIRATION_TIME = 60 * 60 * 24 * 365;
                  document.cookie = `token_v3=${token};max-age=${EXPIRATION_TIME};path=/`;
                  // setCookie('token_v3', res.payload.token);
                  nextPage();
                }
              }

              if (res.code == 401) { setError(res.message) }
            })
            .catch((error) => {
              loading(false)
              setError(`Erreur de connexion à la base de données \n ${error.message}`)
            });
        }
      })
  }
  const router = useRouter();
  const nextPage = () => { router.push('/login/intro') }
  return (
    <>
      <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
        <Paper className='tw-bg-gray-900 tw-rounded-t-none tw-border-[3px] tw-border-[#000] tw-border-t-0' shadow="xl" p="md" radius="lg">
          {/* <Checkbox
            ml="xs"
            my="lg"
            color="dark"
            size="sm"
            label={<Text color='white'>Je suis une collectivité publique</Text>}
            {...form.getInputProps('isCollectivitePublique', { type: 'checkbox' })}
          /> */}
          <TextInput {...inputOptions} {...form.getInputProps('nom')} placeholder='Nom' />
          <TextInput {...inputOptions} {...form.getInputProps('prenom')} placeholder='Prénom' />
          {/* <Input
            mt="sm"
            variant="filled"
            placeholder="Pseudo"
            radius="lg"
            size="md"
          /> */}
          <TextInput {...inputOptions} {...form.getInputProps('email')} placeholder="Adresse mail"
            icon={<SiMaildotru className="tw-text-black tw-relative" />}
          />
          <PasswordInput {...inputOptions} {...form.getInputProps('password')} placeholder="Mot de passe" />
          <PasswordInput {...inputOptions} {...form.getInputProps('passwordConfirmation')} placeholder="Confirmation mot de passe" />

          <Checkbox
            ml="xs"
            my="lg"
            color="dark"
            size="sm"
            error={cguChecked === false ? 'Veuillez accepter les CGU' : ''}
            label={
              <Text color='white'>
                J'accepte les{" "}
                <Link
                  className="tw-text-blue-400 tw-underline"
                  href="/conditions-generales-vente"
                  target="_blank"
                >
                  CGU
                </Link>
              </Text>
            }
            {...form.getInputProps('cgu', { type: 'checkbox' })}
          />
          <HCaptcha
            sitekey="c85832b3-48fd-467f-8c81-99b57c67ce33"
            onLoad={onLoad}
            onVerify={setToken}
            ref={captchaRef}
          />
          {error != '' &&
            <Alert icon={<AiOutlineInfoCircle size="1rem" />} p={'md'} mt='md' color="pink" radius="md" withCloseButton closeButtonLabel='fermer' onClose={() => setError('')}>
              <span className='tw-text-[#d61515]'>{error}</span></Alert>
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
