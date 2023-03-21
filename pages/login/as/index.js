import { Button, Flex } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { BsLock } from 'react-icons/bs'
import Layout from "./layout";

const LinkButton = ({text, href, lock}) => {
    return (
        <Link href={href} className="tw-w-full">
            <Button className="tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800 tw-w-full" radius='lg'>
                {text}
                {lock && <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/>}
            </Button>
        </Link>
    )
}

export default function Page(){
    return (
        <>
            <Head>
                <title>Pace&#8217;sport - connexion</title>
            </Head>
            <h3 className="tw-pt-2 tw-text-center py-4 tw-font-semibold tw-text-white">Se connecter en tant que</h3>
            <Flex justify='center' direction='column' mt='xl' gap="md" px='sm'>
                <LinkButton text='Particulier' href='' />
                <LinkButton text='Sponsor' href='/inscription/sponsor' lock={true} />
                <LinkButton text='Association' href='/inscription/association' lock={true} />
            </Flex>
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }