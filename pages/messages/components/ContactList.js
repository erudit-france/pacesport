import { Avatar, Flex, Indicator, Text } from "@mantine/core"
import Link from "next/link"
import moment from "moment/moment"
import 'moment/locale/fr'

export default function ContactList() {
    const now = new moment()
    const data =
    [
        {
            name: 'Auchan',
            logo: 'https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png',
            message: 'Merci pour votre retour',
            time: now,
            unreadNumber: 2,
        },
        {
            name: 'Decathlon',
            logo: 'https://logos-marques.com/wp-content/uploads/2020/09/Decathlon-logo.png',
            message: 'Merci pour votre retour',
            time: now,
            unreadNumber: 0,
        },
        {
            name: 'Grand frais',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
            message: 'Merci pour votre retour',
            time: now,
            unreadNumber: 0,
        },
        {
            name: 'Grand frais',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
            message: 'Merci pour votre retour',
            time: now,
            unreadNumber: 0,
        },
        {
            name: 'Grand frais',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
            message: 'Merci pour votre retour',
            time: now,
            unreadNumber: 0,
        },
        {
            name: 'Grand frais',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Grand_Frais_logo.png',
            message: 'Merci pour votre retour',
            time: now,
            unreadNumber: 0,
        }
    ]  
    const getDelai = (time) => ( moment(time).fromNow() )

    const messages = data.map((user, i) => {
        return (
            <Link href={`/messages/${i}`} key={i}>
                <Flex className="tw-relative hover:tw-bg-slate-50  
                        hover:tw-text-gray-800 hover:tw-shadow-inner tw-rounded-lg pb-3" 
                        py={'xs'} mb={"sm"} align={'center'}>
                    <Avatar className="tw-shadow-md tw-bg-contain" radius={'xl'} size={'lg'} src={user.logo} />
                    <Flex direction={"column"} ml={'md'}>
                        <Text className="tw-font-semibold" size={'sm'}>{user.name}</Text>
                        <Text size={"xs"} weight={"light"}>{user.message}</Text>
                    </Flex>
                    <Flex className="tw-absolute tw-right-3" direction={'column'}>
                        <Indicator hidden={user.unreadNumber == 0} inline label={user.unreadNumber} 
                                size={18} radius={"xl"}  right={16} color={'red'}></Indicator>
                    </Flex>
                    <Text className="tw-text-gray-500 tw-font-semibold tw-bottom-1 tw-right-1 tw-absolute tw-text-[.7rem]">
                            {getDelai(user.time)}</Text>
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