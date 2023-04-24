import { ActionIcon, BackgroundImage, Box, Button, Center, Container, Flex, Group, Image, Paper, Text, Title } from "@mantine/core";
import Head from "next/head";
import background from '@/public/doodle-pattern.png'
import logo from '@/public/logo.png'
import { IoMdLogIn } from "react-icons/io";
import { BsChevronCompactDown } from "react-icons/bs";
import Link from "next/link";
import { useScrollIntoView } from "@mantine/hooks";
import mockup from "@/public/blank-phone-mockup.png"


export default function Page() {
    const scrollToTwo = () => {
        const element = document.getElementById("section-2");
        element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
    const scrollToThree = () => {
        const element = document.getElementById("section-3");
        element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }

    return (
        <>
            <Head><title>Pace&lsquo;Sport - Accueil</title></Head>
            <Box className="tw-w-[100vw] tw-h-[100vh] tw-overflow-y-scroll tw-bg-scroll tw-overflow-x-hidden tw-snap-y tw-snap-mandatory
                tw-mw-[100vw] tw-mh-[100vh] tw-bg-white tw-invert tw-relative" style={{backgroundImage: `url(${background.src})`}}>
                <section className="tw-w-[100vw] tw-h-[100vh] tw-snap-center">
                    <Flex className="relative tw-justify-end tw-mx-6">
                        <Paper className="tw-bg-white tw-invert tw-h-[85px] tw-w-[85px] tw-rounded-full tw-absolute tw-top-2 tw-mx-auto tw-left-0 tw-right-0">
                            <Image src={logo.src} height={70} width={70} alt="Logo Pace'sport" 
                                className='tw-p-2 tw-mx-auto'/>
                        </Paper>
                    
                        <ActionIcon size={'xl'} radius={'xl'} component="a" href="/login"
                            className="tw-bg-white tw-invert tw-text-black tw-relative tw-top-6 tw-text-[1.3rem] tw-z-10">
                            <IoMdLogIn />
                        </ActionIcon>
                    </Flex>
                    <Center className="tw-w-full tw-h-full tw-relative tw-flex tw-flex-col">
                        <Image className="tw-object-contain tw-relative -tw-top-2 tw-invert" 
                            alt="iphone"
                            src={'/mockup-design-1.png'} width={260} />
                        <Title order={3} className="tw-font-semibold tw-relative -tw-top-2 tw-w-8/12 tw-text-center tw-invert tw-text-white"
                            sx={{textShadow: '#FC0 1px 0 10px'}}>Des réductions dans des centaines d&lsquo;enseignes proches de vous</Title>
                    </Center>
                    <Button className="tw-bg-white tw-px-14 tw-py-3 tw-absolute tw-bottom-3 tw-left-0 tw-right-0 tw-mx-auto
                        tw-invert hover:tw-bg-gray-100 tw-rounded-xl tw-text-black tw-text-[1.5rem]"
                        onClick={() => scrollToTwo()}>
                        <BsChevronCompactDown /></Button>
                </section>
                <section id='section-2'className="tw-w-[100vw] tw-h-[100vh] tw-snap-center tw-relative">
                    <Center className="tw-w-full tw-h-full tw-relative">
                        <Image className="tw-object-contain tw-relative tw-invert -tw-top-12" 
                            alt="iphone"
                            src={'/mockup-design-2.png'} width={300} />
                    </Center>
                    <Button className="tw-bg-white tw-px-14 tw-py-3 tw-absolute tw-bottom-3 tw-left-0 tw-right-0 tw-mx-auto
                            tw-invert hover:tw-bg-gray-100 tw-rounded-xl tw-text-black tw-text-[1.5rem]"
                            onClick={() => scrollToThree()}>
                            <BsChevronCompactDown /></Button>
                </section>
                <section id='section-3' className="tw-w-[100vw] tw-h-[100vh] tw-snap-center tw-relative">
                    <Center className="tw-w-full tw-h-full tw-relative">
                        <Image className="tw-object-contain tw-relative  -tw-top-12" 
                            alt="iphone"
                            src={mockup.src} width={300} />
                    </Center>
                    <Link href='/login'>
                    <Button className="tw-bg-white tw-px-14 tw-py-2 tw-absolute tw-bottom-3 tw-left-0 tw-right-0 tw-mx-auto
                            tw-invert hover:tw-bg-gray-100 tw-rounded-xl tw-text-black tw-text-md">
                            S&lsquo;inscrire</Button></Link>
                </section>
            </Box>
        </>
    )
}