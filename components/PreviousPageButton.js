import { Button, Flex } from "@mantine/core";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

export default function PreviousPageButton(props) {
    const className = props.className ? props.className : ''
    const href = props.href ? props.href : ''
    return (
        <Flex justify='space-between' className={className}>
            <Link href={href}><Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button></Link>
        </Flex>
    )
}