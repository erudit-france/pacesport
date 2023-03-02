import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa'

export default function AssociationCard() {
  return (
    <Link href="https://google.com">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section className='tw-relative'>
            <div className='tw-w-full tw-h-full tw-px-5 tw-absolute tw-bg-slate-700/50 tw-z-20'>
                <div className="tw-flex tw-text-white tw-text-sm tw-w-full tw-pt-5">
                    <div className='tw-font-bold tw-w-1/2'>Asso 1</div>
                    <div className='tw-w-1/2 tw-font-light'>02/03/2023</div>
                </div>

            </div>
            <Image
            className='tw-object-cover'
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={80}
            alt="Norway"
            />
        </Card.Section>

        <Group position="apart" mt="xs" mb="0">
            <Text weight={300}>Voir 8 enseignes</Text>
        </Group>

        <Text  className='tw-flex' size="sm" color="dimmed">
            <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1' />Lyon 8
        </Text>
        </Card>
    </Link>

  );
}