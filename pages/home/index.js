import { ActionIcon, BackgroundImage, Box, Button, Center, Container, Flex, Group, Image, Paper } from "@mantine/core";
import Head from "next/head";
import background from '@/public/doodle-pattern.png'
import logo from '@/public/logo.png'
import { IoMdLogIn } from "react-icons/io";
import { BsChevronCompactDown } from "react-icons/bs";


export default function Page() {
    return (
        <>
            <Head><title>Pace&lsquo;Sport - Accueil</title></Head>
            <Box className="tw-w-[100vw] tw-h-[100vh] tw-overflow-y-scroll tw-bg-scroll tw-overflow-x-hidden
                tw-mw-[100vw] tw-mh-[100vh] tw-bg-white tw-invert tw-relative" style={{backgroundImage: `url(${background.src})`}}>
                    <Flex className="relative tw-justify-end tw-mx-5">
                        <Paper className="tw-bg-white tw-invert tw-h-[85px] tw-w-[85px] tw-rounded-full tw-absolute tw-top-2 tw-mx-auto tw-left-0 tw-right-0">
                            <Image src={logo.src} height={70} width={70} alt="Logo Pace'sport" 
                                className='tw-p-2 tw-mx-auto'/>
                        </Paper>
                    
                        <ActionIcon size={'lg'} radius={'xl'} component="a" href="/login"
                            className="tw-bg-white tw-invert tw-text-black tw-relative tw-top-8 tw-text-[1.3rem]">
                            <IoMdLogIn />
                        </ActionIcon>
                    </Flex>
                    <Button className="tw-bg-white tw-px-14 tw-py-3 tw-absolute tw-bottom-3 tw-left-0 tw-right-0 tw-mx-auto
                        tw-invert hover:tw-bg-gray-100 tw-rounded-xl tw-text-black tw-text-[1.5rem]"
                        onClick={() => body.scrollTop(document.getElementById('section-2').offset().top)}>
                        <BsChevronCompactDown /></Button>
                    
                <section id="section-2" className="tw-w-[100vw] tw-h-[100vh] ">
                </section>
                <section className="tw-w-[100vw] tw-h-[100vh] ">
                </section>
                <section className="tw-w-[100vw] tw-h-[100vh]">
                </section>
            </Box>
        </>
    )
}