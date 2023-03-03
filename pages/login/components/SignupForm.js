import { SiMaildotru } from 'react-icons/si'
import { Button, Checkbox, Flex, Input, Paper, PasswordInput } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

export default function SignupForm({overlayHandler}) {
  const submitHandler = () => {
    setTimeout(() => {
      overlayHandler(false)
    }, 1000);
    overlayHandler(true)
  }

  return (
    <>
      <Paper shadow="xl" p="md" radius="lg">
        <Input
          variant="filled"
          placeholder="Nom & prénom"
          radius="lg"
          size="md"
        />
        <Input
          mt="sm"
          variant="filled"
          placeholder="Pseudo"
          radius="lg"
          size="md"
        />
        <Input
          mt="sm"
          icon={<SiMaildotru className="tw-text-black tw-relative" />}
          variant="filled"
          placeholder="Adresse mail"
          radius="lg"
          size="md"
        />

        <PasswordInput
          mt="sm"
          placeholder="Mot de passe"
          variant="filled"
          radius="lg"
          size="md"
        />

        <PasswordInput
          mt="sm"
          placeholder="Confirmation mot de passe"
          variant="filled"
          radius="lg"
          size="md"
        />

        <Checkbox
          ml="xs"
          my="lg"
          color="dark"
          size="sm"
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
        />
      </Paper>

      <Flex justify="center" align="center" direction="row" mt="md">
        <Button
          onClick={() => submitHandler()}
          className="tw-bg-pink-600 hover:tw-bg-pink-700 tw-shadow-sm"
          radius="xl"
          size="lg"
        >
          Inscription
        </Button>
      </Flex>
    </>
  );
}
