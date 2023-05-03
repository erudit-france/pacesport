import Navbar from "@/components/navbar/Navbar";
import AppContext from "@/context/AppContext";
import { Avatar, BackgroundImage, Box, Center, Flex, Text, Title } from "@mantine/core";
import { useContext } from "react";

export default function Layout({children}){

    return (
        <>
            <Navbar />
            <main className="tw-w-screen tw-h-screen">
                <BackgroundImage className="tw-h-full tw-opacity-10 tw-absolute tw-top-0 -tw-z-10" src='/doodle-pattern.png' />
                <Box className="tw-h-[9rem] tw-w-full tw-relative tw-top-0 -tw-z-9 tw-rounded-br-[3rem] tw-overflow-hidden">
                    <BackgroundImage className="tw-h-full tw-absolute -tw-z-8 tw-blur-[1px]" src='/stadium_chairs.jpg' />
                    <div className="tw-h-[9rem] tw-w-full tw-bg-red-900/20 tw-absolute -tw-z-7">
                        <Center className="tw-h-full">
                            <Title order={3} color="white" align="center" weight={500}>Annuaire</Title>
                            <Flex direction={'column'} className="tw-absolute tw-right-3">
                                <Avatar src={`uploads/${children?.props.user.avatar?.name}`} mx={'auto'} radius={'xl'} />
                                {children?.props.user.prenom &&
                                    <Text fz={'sm'} weight={500} color="white" align="center">{children?.props.user.prenom}</Text>}
                            </Flex>
                        </Center>
                    </div>
                </Box>
                {children}
            </main>
        </>
    )
}