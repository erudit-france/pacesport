import { Card, Image, Text, Badge, Button, Group, Avatar } from '@mantine/core';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa'

export default function EnseigneCard() {
  return (
    <Link href="https://google.com">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section className='tw-relative'>
            <Image
            className='tw-object-cover'
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={80}
            alt="Norway"
            />
            <Avatar className='p-2 -tw-bottom-4 tw-absolute tw-bg-white tw-shadow-md tw-z-20 tw-left-3' size="md"  radius="xl" src={"https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png"} />
        </Card.Section>

        <Group position="apart" mt="lg" mb="0">
            <Text weight={400}>Auchan</Text>
        </Group>

        <Text  className='tw-flex' size="sm" color="dimmed">
            <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1' />Lyon 8
        </Text>
        </Card>
    </Link>

  );
}