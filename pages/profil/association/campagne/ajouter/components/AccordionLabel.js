import { Avatar, Group, Text } from "@mantine/core";

export default function AccordionLabel({image, label}) {
    return (
        <Group noWrap>
        <Avatar src={image} radius="xl" size="lg" />
        <div>
            <Text weight={600}>{label}</Text>
        </div>
        </Group>
    )
}