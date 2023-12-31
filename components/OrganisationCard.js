import { Card, Image, Text, Badge, Button, Group, Flex } from '@mantine/core';
import moment from 'moment';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa'

export default function OrganisationCard({organisation}) {
    return (
        <Link href={`/profil/sponsor/association/${organisation.id}`}>
            <Card className='tw-bg-gradient-to-br tw-from-[#d61515] tw-to-[#d61515] tw-border-0 tw-mx-2' shadow="md" radius="md" withBorder>
                <Card.Section className='tw-relative'>
                    <div className='tw-w-full tw-h-full tw-px-4 tw-absolute tw-bg-slate-700/20 tw-z-20'>
                    </div>
                    <Image
                    className='tw-object-cover blur'
                    src={`/uploads/${organisation.avatar?.name}`}
                    height={50}
                    alt={organisation.name}
                    />
                </Card.Section>

                <Group position="apart" mt="xs" mb="0">
                    <Text className='tw-text-gray-200' weight={400}>{organisation.name}</Text>
                </Group>

                <Text  className='tw-flex tw-text-gray-200' size="sm" weight={300}>
                    <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1' />{organisation.address}
                </Text>
            </Card>
        </Link>

    );
}