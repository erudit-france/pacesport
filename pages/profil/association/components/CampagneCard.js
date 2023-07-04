import { AspectRatio, Badge, Box, Button, Flex, Image, Text } from "@mantine/core";
import moment from "moment";
import Link from "next/link";

export default function CampagneCard({id, title, image, startDate, status}){
    const nbCartes = 1
    const statusString = (status) => { return status == 1 ? 'Active' : 'En attente' }
    const Status = () => (
        <Text fz={'sm'} my={'xs'} transform="uppercase">
        Status: 
        <Badge className="tw-font-normal tw-uppercase tw-ml-3" 
            size="sm" 
            color={status == 1 ? 'teal' : 'indigo'}>
            {statusString(status)}</Badge></Text>
    )

    return (
        <>
            <Flex className="tw-mb-7 tw-justify-around lg:tw-max-w-2xl lg:tw-mx-auto">
                    <Box className="tw-rounded-xl tw-shadow-md tw-relative">
                        <Image
                            className="tw-absolute tw-right-1 tw-z-10 tw-opacity-80 -tw-translate-y-full tw-top-1/2"
                            width={26}
                            height={26}
                            src={`/sim.png`}
                            alt="logo sim"
                        />
                        <Image
                            width={180}
                            height={90}
                            src={`/uploads/${image}`}
                            alt="Photo de campagne"
                        />
                    </Box>
                    <Flex direction={'column'} ml={'lg'} justify={'space-around'}>
                        <Status />
                        <Text fz={'sm'} className="tw-capitalize">{nbCartes}&nbsp; Carte{nbCartes > 1 ? 's' : ''}</Text>
                        <Link href={`/profil/association/campagne/${id}`} >
                            <Button size="xs" className="tw-bg-gold-400/90 tw-text-gray-100 tw-text-xs tw-rounded-3xl tw-px-10 tw-h-8 tw-my-2 tw-shadow-md
                                    hover:tw-bg-gold-400">
                                    Détail</Button>
                        </Link>
                    </Flex>
            </Flex>
        </>
    )
}