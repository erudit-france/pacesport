import { AspectRatio, Badge, Button, Flex, Text } from "@mantine/core";
import Image from "next/image";

export default function CampagneCard(){
    const url = 'https://images.unsplash.com/photo-1628891890377-57dba2715caf'
    const status = 1
    const statusString = (status) => { return status == 1 ? 'Active' : 'En attente' }

    return (
        <>
            <Flex className="tw-mb-7">
                    <Image
                        className="tw-rounded-xl tw-shadow-sm"
                        width={120}
                        height={50}
                        src={url}
                        alt="Photo de campagne"
                    />
                    <Flex direction={'column'} ml={'lg'} justify={'space-around'}>
                        <Text fz={'xs'}>Campagne X</Text>
                        <Text fz={'xs'} color={"gray"}>
                            Status: 
                            <Badge className="tw-font-normal tw-uppercase tw-ml-3" 
                                size="sm" 
                                color={status == 1 ? 'teal' : 'indigo'}>
                                {statusString(status)}</Badge></Text>
                        <Button size="xs" className="tw-bg-gray-900 tw-text-gray-100 tw-text-xs tw-rounded-xl tw-px-10 tw-h-6
                                hover:tw-bg-black">
                                Détail</Button>
                    </Flex>
            </Flex>
        </>
    )
}