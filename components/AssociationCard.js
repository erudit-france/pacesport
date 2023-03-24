import { Card, Image, Text, Badge, Button, Group, Flex } from '@mantine/core';
import moment from 'moment';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa'

export default function AssociationCard({card}) {
    var date = moment(card.startDate);
    var dateComponent = date.utc().format('DD/MM/YYYY');
    const logoUrl = card.association.logo 
    ? '/uploads/images/' + card.association.logo
    : null
    return (
        <Link href={`campagne/${card.id}`}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section className='tw-relative'>
                <div className='tw-w-full tw-h-full tw-px-4 tw-absolute tw-bg-slate-700/50 tw-z-20'>
                    <Flex justify={'space-between'} className="tw-text-white tw-text-sm tw-w-full tw-pt-5">
                        <div className='tw-font-bold tw-w-1/2'>{card.name}</div>
                        <div className='tw-w-1/2 tw-font-light tw-text-end'>{dateComponent}</div>
                    </Flex>

                </div>
                <Image
                className='tw-object-cover'
                src={logoUrl}
                height={80}
                alt={card.association.name}
                />
            </Card.Section>

            <Group position="apart" mt="xs" mb="0">
                <Text weight={300}>Voir {card.discountOffers.length} enseignes</Text>
            </Group>

            <Text  className='tw-flex' size="sm" color="dimmed">
                <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1' />{card.association.name}
            </Text>
            </Card>
        </Link>

    );
}