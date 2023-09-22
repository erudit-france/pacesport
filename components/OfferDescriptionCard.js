import { Avatar, Card, Center, Flex, Spoiler, Text } from "@mantine/core";
import SponsoringOfferTypeBadge from "./SponsoringOfferTypeBadge";
import { FaMapMarkerAlt } from "react-icons/fa";
import moment from "moment/moment";
import { useState } from "react";

export default function OfferDescriptionCard({offer}) {
    const [opened, setOpened] = useState(false)

    return (
        <Card className='tw-flex tw-bg-gray-200 tw-mb-2' radius={'lg'}>
            <Center>
            <Avatar className='tw-shadow-md' radius={'lg'} src={`/uploads/${offer.enseigne?.avatar?.name}`} />
            </Center>
            <Flex direction={'column'} className='tw-flex-1 tw-px-3'>
            <Flex justify={'space-between'}>
                <Text weight={550}>{offer.enseigne.name} <SponsoringOfferTypeBadge offer={offer} /></Text>
                <Text className='tw-flex tw-font-light' fz={'sm'}>
                <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1 tw-text-gray-800' />{offer.enseigne?.ville}</Text>
            </Flex>
            <Text color=''>{offer.titre}</Text>
            <Spoiler 
                styles={
                    {'control': { float: 'right', fontSize: '14px'}}
                }
                maxHeight={40} showLabel="Plus ▾" hideLabel="Moins ▴">
                <Text color='dimmed'>{offer.description}</Text>
            </Spoiler>
            <Text className='tw-relative tw-bottom-1 tw-mr-1 tw-font-light tw-text-end' fz={'xs'}>{'du ' + moment(offer.createdAt).utc().format('DD/MM/YYYY') + ' au ' + moment(offer.createdAt).add(1, 'years').utc().format('DD/MM/YYYY')}</Text>
            </Flex>
        </Card>
    )
}