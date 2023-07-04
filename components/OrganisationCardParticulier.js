import { Card, Image, Text, Badge, Button, Group, Flex, Avatar, Box } from '@mantine/core';
import moment from 'moment';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa'

export default function OrganisationCardParticulier({organisation}) {
    return (
        <Link href={`/profil/particulier/association/${organisation.id}`}>
            <Card className='tw-bg-gradient-to-br tw-from-gray-50 tw-to-white tw-border-0 tw-relative' shadow="md" padding="md" radius="lg" withBorder>
                <Card.Section className='tw-relative'>
                    <div className='tw-w-full tw-h-full tw-px-4 tw-absolute tw-bg-slate-700/20 tw-z-20'>
                    </div>
                    <Image
                    className='tw-object-cover blur'
                    src={`/uploads/${organisation.backgroundImage?.name}`}
                    height={60}
                    alt={organisation.name}
                    />
                </Card.Section>

                <Avatar
                    className='tw-shadow-md tw-relative -tw-top-4 tw-opacity-100'
                    radius={'xl'}
                    src={`/uploads/${organisation.avatar?.name}`}
                 />

                <Box className='tw-relative -tw-top-2'>
                    <Text className='' weight={400}>{organisation.name}</Text>
                    <Text  className='tw-flex ' size="sm" weight={300}>
                        <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1' />{organisation.address}
                    </Text>
                </Box>
            </Card>
        </Link>

    );
}