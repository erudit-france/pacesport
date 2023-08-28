import { Avatar, Flex, Indicator, Text } from "@mantine/core"
import Link from "next/link"
import moment from "moment/moment"
import 'moment/locale/fr'

export default function ContactList({chatRooms}) {
    const list = 
        chatRooms 
        ? chatRooms.length == 0
            ? <Text align="center">Aucun message</Text>
            : chatRooms.map((chatRoom, i) => {
            return (
                <Link href={`/messages/${chatRoom.id}`} key={i}>
                    <Flex className="tw-relative hover:tw-bg-slate-50  
                            hover:tw-text-gray-800 hover:tw-shadow-inner tw-rounded-lg pb-3" 
                            py={'xs'} mb={"sm"} align={'center'}>
                        <Avatar className="tw-shadow-md tw-bg-contain" radius={'xl'} size={'lg'} src={chatRoom.logo } />
                        <Flex direction={"column"} ml={'md'}>
                            <Text className="tw-font-semibold" size={'sm'}>{chatRoom.name}</Text>
                            <Text size={"xs"} weight={"light"}>--</Text>
                        </Flex>
                        <Flex className="tw-absolute tw-right-3" direction={'column'}>
                            {/* <Indicator hidden={chatRoom.unreadNumber == 0} inline label={chatRoom.unreadNumber} 
                                    size={18} radius={"xl"}  right={16} color={'red'}></Indicator> */}
                        </Flex>
                        {/* <Text className="tw-text-gray-500 tw-font-semibold tw-bottom-1 tw-right-1 tw-absolute tw-text-[.7rem]">
                                {getDelai(chatRoom.time)}</Text> */}
                    </Flex>
                </Link>
            )})
        : <Text align="center">Chargement</Text>

    return (
        <>{list}</>
    )
}