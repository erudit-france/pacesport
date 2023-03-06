import { Button, Flex } from "@mantine/core";
import Link from "next/link";
import { BsLock } from 'react-icons/bs'
import Layout from "./layout";

export default function Page(){
    return (
        <>
            <h3 className="text-center py-4 tw-font-semibold tw-text-white">Se connecter en tant que</h3>
            <Flex justify='center' direction='column' mt='xl' gap="md" px='sm'>
                <Button className="tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800" radius='lg'>Particulier</Button>
                <Button className="tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800" disabled radius='lg'>Sponsor <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/></Button>
                <Link href='/profil/(association)/' className="tw-w-full">
                    <Button className="tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800 tw-w-full" radius='lg'>Association <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/></Button>
                </Link>
            </Flex>
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }