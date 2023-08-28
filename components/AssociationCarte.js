import { Card, Image, Text, Badge, Button, Group, Flex, Avatar, Box } from '@mantine/core';
import moment from 'moment';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa'

export default function AssociationCarte({organisation, href}) {
    const avatarSrc = organisation.avatar?.name
        ? `/uploads/${organisation.avatar?.name}`
        : '/uploads/Logo-generique-PS-64ed03acc9d40.png'

    const backgroundSrc = organisation.backgroundImage?.name
        ? `/uploads/${organisation.backgroundImage?.name}`
        : '/uploads/chair-64ed03a87ecb9.jpg'

    const BackgroundImage = () => {
        if (backgroundSrc == null){
            return (
                <Image
                className='tw-object-cover blur'
                withPlaceholder
                height={50}
                alt={organisation.name}
                />
            )
        }
        return (
            <Image
            className='tw-object-cover blur'
            src={`${backgroundSrc}`}
            height={50}
            alt={organisation.name}
            />
        )
    }

    
    const AvatarImage = () => {
        if (avatarSrc == null){
            return (
                <Avatar
                    className='tw-shadow-md tw-relative -tw-top-4 tw-opacity-100'
                    radius={'xl'}
                />
            )
        }
        return (
            <Avatar
                className='tw-shadow-md tw-relative -tw-top-4 tw-opacity-100'
                radius={'xl'}
                src={avatarSrc}
                />
        )
    }
    

    
    return (
        <Link href={href}>
            <Card className='tw-bg-gradient-to-br tw-from-gray-50 tw-to-white tw-border-0 tw-relative tw-mx-3 tw-py-4 tw-max-h-96 tw-shadow-md tw-h-48' shadow="md" radius="lg" withBorder>
                <Card.Section className='tw-relative'>
                    <div className='tw-w-full tw-h-full tw-px-4 tw-absolute tw-bg-slate-700/20 tw-z-20'></div>
                    <BackgroundImage />
                </Card.Section>

                <AvatarImage />

                <Box className='tw-relative -tw-top-2'>
                    <Text fz={'sm'} className='' weight={400}>{organisation.name}</Text>
                    <Text fz={'sm'} className='tw-flex' weight={300}>
                        <FaMapMarkerAlt className='tw-relative tw-top-1 tw-mr-1' />{organisation.ville}
                    </Text>
                </Box>
            </Card>
        </Link>

    );
}