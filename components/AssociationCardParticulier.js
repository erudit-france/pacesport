import { Card, Image, Text, Badge, Button, Group, Flex, Box } from '@mantine/core';
import moment from 'moment';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa'

export default function AssociationCardParticulier({card}) {
    var date = moment(card.startDate);
    var dateComponent = date.utc().format('DD/MM/YYYY');
    const logoUrl = card.image?.name 
        ? '/uploads/' + card.image.name
        : null

    return (
        <Link href={`/profil/particulier/campagne/${card.id}`}>
            <Card className='tw-bg-gradient-to-br tw-from-red-600/60 tw-to-red-700/90 tw-border-0' shadow="md" padding="lg" radius="md" withBorder>
                <Card.Section className='tw-relative'>
                    <div className='tw-w-full tw-h-full tw-px-4 tw-absolute tw-bg-slate-700/50 tw-z-20'>
                        <Flex justify={'space-between'} className="tw-text-white tw-text-sm tw-w-full tw-pt-5">
                            <div className='tw-font-bold tw-w-1/2'>{card.name}</div>
                            <div className='tw-w-1/2 tw-font-light tw-text-end'>{dateComponent}</div>
                        </Flex>

                    </div>
                    <Image
                    className='tw-object-cover blur'
                    src={logoUrl}
                    height={90}
                    alt={card.association.name}
                    />
                </Card.Section>
                <Box>
                    <Text color='white' pt={'md'} fz={'xs'}>
                        Valable dans {
                            card.acceptedDiscountOffersCount
                        } enseignes
                    </Text>
                    <Button variant="outline" color="gray" fullWidth mt="md" size='xs' radius="md" className='tw-bg-gradient-to-l tw-from-red-500/60 tw-to-red-500/90 tw-text-gray-50'>
                        Détail
                    </Button>
                </Box>
            </Card>
        </Link>

    );
}