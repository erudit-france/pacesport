import { Button, Flex } from "@mantine/core";
import { BsLock } from 'react-icons/bs'
import Layout from "./Layout";

export default function Page(){
    return (
        <main className="tw-bg-gradient-to-b tw-from-red-500 tw-to-red-700 tw-rounded-t-[2rem]"
            style={{ minHeight: 'calc(100vh - 144px)' }}>
            <h3 className="text-center py-4 tw-font-semibold tw-text-white">Se connecter en tant que</h3>
            <Flex justify='center' direction='column' mt='xl' gap="md" px='sm'>
                <Button className="tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800" radius='lg'>Particulier</Button>
                <Button className="tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800" disabled radius='lg'>Sponsor <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/></Button>
                <Button className="tw-bg-white hover:tw-bg-slate-100 tw-text-gray-800" disabled radius='lg'>Association <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/></Button>
            </Flex>
        </main>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }