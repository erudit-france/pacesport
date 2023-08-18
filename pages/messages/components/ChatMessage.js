import { Flex, Paper, Text } from "@mantine/core";
import moment from "moment/moment";
import 'moment/locale/fr'
import Image from "next/image";
import Link from "next/link";

export default function ChatMessage({message, setPreviewImage}) {
    const Attachment = () => {
        const filename = message.attachments[0].name
        const isImage = (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(filename)
        if (isImage) {
            return (
                <Image onClick={() => setPreviewImage(message.attachments[0])} width={100} height={60} src={`/uploads/${filename}`} alt="attachment" />
            )
        } else {
            return (
                <Link className="tw-text-[.92rem] tw-text-blue-500 tw-underline" target="_blank" href={`/uploads/${filename}`}>{filename}</Link>
            )
        }
    }

    return (
        <>
            {message &&
            <Flex  className="tw-w-full tw-mb-2" justify={message.isContact ? 'start' : 'end'}>
                <Flex direction={'column'}>
                    <Paper shadow="xs" radius="md" 
                            className={`${message.isContact ? 'tw-bg-[#d61515] tw-text-white' : 'tw-bg-gray-50'} tw-p-2.5 tw-py-1.5`}>
                        {message.attachments.length > 0 &&
                            <Attachment />
                        }
                        <Text className="tw-text-[.92rem]">{message.message}</Text>
                    </Paper>
                    <Text fz={8} className="tw-mt-[2px]" color="dimmed" align={message.isContact ? 'left' : 'right'}>{moment(message.createdAt).format('DD/MM HH:mm')}</Text>
                </Flex>
            </Flex> 
            }
        </>
    )
}