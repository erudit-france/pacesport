import { AspectRatio, Badge, Box, Button, Center, Flex, Image, Text } from "@mantine/core";
import moment from "moment";
import Link from "next/link";

export default function CampagneCard({id, title, image, startDate, status, image2}){
    const src = image == null || undefined ? '/logo.png' : `/uploads/${image}`
    const src2 = image2 == null || undefined ? '/logo.png' : `/uploads/${image2}`
    const nbCartes = 1
    const statusString = (status) => { return status == 1 ? 'Active' : 'En attente' }
    const Status = () => (
        <Text fz={'sm'} my={'xs'} transform="uppercase">
        Statut: 
        <Badge className="tw-font-normal tw-uppercase tw-ml-3 tw-mr-5" 
            size="sm" 
            color={status == 1 ? 'teal' : 'indigo'}>
            {statusString(status)}</Badge></Text>
    )

    return (
        <>
            <Flex className="tw-mb-7 tw-justify-around lg:tw-max-w-2xl lg:tw-mx-auto">
                    <Center>
                        <Box className="tw-rounded-xl tw-shadow-md tw-relative">
                            <Image
                                className="tw-rounded-xl tw-absolute tw-left-5 tw-z-10 tw-opacity-80 -tw-translate-y-full tw-top-10"
                                width={26}
                                height={26}
                                src={src2}
                                alt="logo sim"
                            />
                            <Image
                            className="tw-rounded-xl tw-rounded-xl"
                                width={250}
                                height={130}
                                src={src}
                                alt="Photo de campagne"
                            />
                        </Box>
                    </Center>
            </Flex>
            <Flex direction={'column'} ml={'lg'} justify={'space-around'}>
                <Center>
                        <Status />
                        <Link href={`/profil/association/carte`} >
                            <Button size="xs" className="tw-bg-[#d61515] tw-text-gray-100 tw-text-xs tw-rounded-3xl tw-px-10 tw-h-8 tw-my-2 tw-shadow-md
                                    hover:tw-bg-[#d61515]">
                                    Détail</Button>
                        </Link>
                </Center>
                    </Flex>
        </>
    )
}