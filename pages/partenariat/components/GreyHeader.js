import { Text } from "@mantine/core";
import Image from "next/image";
import hero from '@/public/chair.jpg'

export default function GreyHeader({text}) {
    return (
        <header className='tw-flex tw-justify-center tw-h-32 tw-relative 
            tw-bg-gradient-to-b tw-from-slate-500 tw-to-gray-600
            tw-w-full tw-align-middle'>
            <Text weight={'bold'} transform={'uppercase'} align="center"
                className="tw-my-auto tw-text-gray-300 tw-pb-4">{text}</Text>
        </header>
    )
}