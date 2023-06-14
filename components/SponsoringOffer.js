import { Card, Image, Text, Badge, Button, Group, Flex, Title } from '@mantine/core';
import moment from 'moment';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa'

export default function SponsoringOfferCard({offer}) {
    var img = offer.images.length != 0 ? '/uploads/' + offer.images[0].name : null
    console.log('offer', offer)

    return (
        <Link href={`/profil/sponsor/sponsoring/${offer.id}`}>
            <Card className='tw-bg-gradient-to-br tw-from-gray-50 tw-to-white tw-border-0' shadow="md" padding="lg" radius="md" withBorder>
                <Card.Section className='tw-relative'>
                    <div className='tw-w-full tw-h-full tw-px-4 tw-absolute tw-bg-slate-700/50 tw-z-20 tw-flex tw-flex-col tw-justify-around'>
                        <Title order={3}>{offer.association?.name}</Title>
                        <Flex justify={'space-between'} className="tw-text-white tw-text-sm tw-w-full">
                            <div className='tw-font-bold tw-w-1/2'>{offer.title}</div>
                            <div className='tw-w-1/2'>{offer.description}</div>
                        </Flex>
                        <Text color='white'>{offer.price} €</Text>
                    </div>
                    <Image
                    className='tw-object-cover blur'
                    src={img}
                    height={120}
                    alt={offer.title}
                    />
                </Card.Section>


            </Card>
        </Link>
    )
}