import { SiMaildotru } from 'react-icons/si'
import { Button, Checkbox, Flex, Input, Paper, PasswordInput } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm({overlayHandler}) {
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
      </Paper>

      <Flex justify="center" align="center" direction="row" mt="md">
        <Button
          onClick={() => submitHandler()}
          className="tw-bg-pink-600 hover:tw-bg-pink-700 tw-shadow-sm"
          radius="xl"
          size="lg"
        >
          Connexion
        </Button>
      </Flex>
    </>
  );
}
