import { Accordion, Button, Flex, Text } from "@mantine/core";
import AccordionLabel from "./AccordionLabel";
import { BiMessage } from 'react-icons/bi'

export default function AccordionItem({id, label, content, image}) {
    return (
        <Accordion.Item value={label} key={id}>
            <Accordion.Control>
            <AccordionLabel image={image}  label={label} />
            </Accordion.Control>
            <Accordion.Panel>
                <Text size="sm">{content}</Text>
                <Flex justify={'end'}>
                <Button size="xs" variant="filled" radius={'lg'} 
                    className="tw-bg-yellow-600/70 hover:tw-bg-yellow-600/80 tw-text-white"
                    leftIcon={<BiMessage className="tw-relative tw-top-[1px] tw-left-0.5"/>}>
                    Contacter</Button>
                </Flex>
            </Accordion.Panel>
        </Accordion.Item>
    )
}