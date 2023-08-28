import { Button, Flex } from "@mantine/core";
import { getCookie } from "cookies-next";
import Head from "next/head";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { BsLock } from "react-icons/bs";
import Layout from "./layout";

export default function Page() {
    const router = useRouter()
    const updateAccountStatus = (role) => {
        const data = new FormData()
        data.append('role', role)
        fetch(`/api/account/status/update`, {
        method: "POST",
        headers: {
            'JWTAuthorization': `Bearer ${getCookie('token')}`,
        },
        body: data,
        })
      .then((res) => res.json())
      .then((res) => {
        if (res.code == 401) {router.push('/login'); return;}
        router.push('/inscription')
      });
  };
  return (
    <>
      <Head>
        <title>Pace&#8217;sport - connexion</title>
      </Head>
      <h3 className="tw-pt-2 tw-text-center py-4 tw-font-semibold tw-text-white">
        Finaliser l'inscription
      </h3>
      <Flex justify="center" direction="column" mt="xl" gap="md" px="sm">
        <Button
          className="tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800"
          radius="lg"
          onClick={() => updateAccountStatus('USER')}
        >
          Particulier
        </Button>
        <Button
          className="tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800"
          radius="lg"
          onClick={() => updateAccountStatus('SPONSOR')}
        >
          Sponsor <BsLock className="tw-text-[#d61515] tw-my-auto tw-ml-1" />
        </Button>
        <Link href="/profil/association/" className="tw-w-full">
          <Button
            className="tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800 tw-w-full"
            radius="lg"
            onClick={() => updateAccountStatus('ASSOCIATION')}
          >
            Association
            <BsLock className="tw-text-[#d61515] tw-my-auto tw-ml-1" />
          </Button>
        </Link>
      </Flex>
    </>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
