import { AspectRatio, Badge, Button, Flex, Image, Text } from "@mantine/core";
import moment from "moment";
import Link from "next/link";

export default function CampagneCard({id, title, image, startDate}){
    const status = 1
    const statusString = (status) => { return status == 1 ? 'Active' : 'En attente' }

    return (
        <>
            <Flex className="tw-mb-7">
                    <Image
                        className="tw-rounded-xl tw-shadow-md"
                        width={180}
                        height={90}
                        src={`/uploads/${image}`}
                        alt="Photo de campagne"
                    />
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