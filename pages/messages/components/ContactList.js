import { Avatar, Flex, Indicator, Text } from "@mantine/core"
import TimeDiff from 'js-time-diff';
import Link from "next/link";

export default function ContactList() {
    const data =
    [
        {
            name: 'Auchan',
            logo: 'https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png',
            message: 'Merci pour votre retour',
            time: '1 minute',
            unreadNumber: 2,
        },
        {
            name: 'Decathlon',
            logo: 'https://logos-marques.com/wp-content/uploads/2020/09/Decathlon-logo.png',
            message: 'Merci pour votre retour',
            time: '07/03',
            unreadNumber: 0,
        },
        {
            name: 'Grand frais',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
            message: 'Merci pour votre retour',
            time: '01/03',
            unreadNumber: 0,
        },
        {
            name: 'Grand frais',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
            message: 'Merci pour votre retour',
            time: '01/03',
            unreadNumber: 0,
        },
        {
            name: 'Grand frais',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
            message: 'Merci pour votre retour',
            time: '01/03',
            unreadNumber: 0,
        },
        {
            name: 'Grand frais',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
            message: 'Merci pour votre retour',
            time: '01/03',
            unreadNumber: 0,
        },
        {
            name: 'Grand frais',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
            message: 'Merci pour votre retour',
            time: '01/03',
            unreadNumber: 0,
        },
        {
            name: 'Grand frais',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
            message: 'Merci pour votre retour',
            time: '01/03',
            unreadNumber: 0,
        }
        
    ]  

    const messages = data.map((user, i) => {
        return (
            <Link href={`/messages/${i}`} key={i}>
                <Flex className="tw-relative hover:tw-bg-slate-50  
                        hover:tw-text-gray-800 hover:tw-shadow-inner tw-rounded-lg" 
                        py={'xs'} mb={"sm"} align={'center'}>
                    <Avatar className="tw-shadow-md tw-bg-contain" radius={'xl'} size={'lg'} src={user.logo} />
                    <Flex direction={"column"} ml={'md'}>
                        <Text className="tw-font-semibold" size={'sm'}>{user.name}</Text>
                        <Text size={"xs"} weight={"light"}>{user.message}</Text>
                    </Flex>
                    <Flex className="tw-absolute tw-right-3">
                        <Indicator hidden={user.unreadNumber == 0} inline label={user.unreadNumber} 
                                size={18} radius={"xl"} top={9} right={16} color={'red'}></Indicator>
                        <Text className="tw-text-gray-500 tw-font-semibold" size={"xs"}>{user.time}</Text>
                    </Flex>
                </Flex>
            </Link>
        )
    })

    return (
        <>
            {
                data.length > 0 ?
                    messages
                    : <Text align="center">Aucun message</Text>
            }
        </>
    )
}