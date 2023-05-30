import { AspectRatio, Badge, Box, Button, Flex, Image, Text } from "@mantine/core";
import moment from "moment";
import Link from "next/link";

export default function CampagneCard({id, title, image, startDate}){
    const status = 1
    const statusString = (status) => { return status == 1 ? 'Active' : 'En attente' }

    return (
        <>
            <Flex className="tw-mb-7">
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
                        <Text fz={'md'} weight={550} className="tw-capitalize">{title}</Text>
                        <Text color="dimmed" fz={'xs'}>{moment(startDate).format('DD/MM/YYYY')}</Text>
                        <Text fz={'xs'} color={"gray"} my={'sm'}>
                            Status: 
                            <Badge className="tw-font-normal tw-uppercase tw-ml-3" 
                                size="sm" 
                                color={status == 1 ? 'teal' : 'indigo'}>
                                {statusString(status)}</Badge></Text>
                            <Link href={`/profil/association/campagne/${id}`}>
                                <Button size="xs" className="tw-bg-gray-900 tw-text-gray-100 tw-text-xs tw-rounded-xl tw-px-10 tw-h-6
                                        hover:tw-bg-black">
                                        Détail</Button>
                            </Link>
                    </Flex>
            </Flex>
        </>
    )
}