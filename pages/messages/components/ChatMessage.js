import { Flex, Paper, Text } from "@mantine/core";
import moment from "moment/moment";
import 'moment/locale/fr'

export default function ChatMessage({message}) {
    // const delai = moment(message.time).fromNow();

    return (
        <>
            {/* <Flex  className="tw-w-full tw-mb-1" justify={message.isContact ? 'start' : 'end'}>
                <Paper shadow="xs" radius="md" 
                        className={`${message.isContact ? 'tw-bg-red-500 tw-text-white' : 'tw-bg-gray-50'} tw-p-2.5 tw-py-1.5`}>
                    <Text className="tw-text-[.92rem]">{message.data}</Text>
                </Paper>
            </Flex> */}
            {/* <Text align={message.isContact ? 'start' : 'end'} className="tw-text-[.6rem] tw-text-gray-500">{delai}</Text> */}
        </>
    )
}