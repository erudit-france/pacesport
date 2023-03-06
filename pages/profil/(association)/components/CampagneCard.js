import { AspectRatio, Button, Flex, Text } from "@mantine/core";
import Image from "next/image";

export default function CampagneCard(){
    const url = 'https://images.unsplash.com/photo-1628891890377-57dba2715caf'

    return (
        <>
            <Flex className="tw-mt-3">
                    <Image
                        className="tw-rounded-xl tw-shadow-sm"
                        width={120}
                        height={50}
                        src={url}
                        alt="Photo de campagne"
                    />
                    <Flex direction={'column'} ml={'lg'} >
                        <Text fz={'sm'}>Campagne X</Text>
                        <Text fz={'sm'}>Status: <span className="tw-font-semibold tw-text-green-600">Active</span></Text>
                        <Button size="xs" className="tw-bg-gray-900 tw-text-gray-100 tw-text-xs tw-rounded-xl tw-px-12
                                hover:tw-bg-black">
                                Détail</Button>
                    </Flex>
            </Flex>
        </>
    )
}