import { Carousel } from "@mantine/carousel";
import { Avatar, Card, Group, Image, Text } from "@mantine/core";

export default function CommunicationAdsCarousel({communications}) {
    const CommunicationCard = ({communication}) => {
        let backgroundImg = communication.enseigne 
                        ? '/uploads/' + communication.enseigne.backgroundImage?.name 
                        : communication.association
                            ? '/uploads/' + communication.association.backgroundImage?.name
                            : null

                            
        let avatarImg = communication.enseigne 
                    ? '/uploads/' + communication.enseigne.avatar?.name 
                    : communication.association
                        ? '/uploads/' + communication.association.avatar?.name
                        : null
        let publisher = communication.enseigne
                            ? communication.enseigne.name
                            : communication.association
                                ? communication.association.name
                                : ''
        return (
            <Card shadow="sm" p="lg" radius="lg" withBorder>
                <Card.Section>
                    <Image
                    src={backgroundImg}
                    height={50}
                    className="tw-object-cover"
                    alt={`${publisher} logo`}
                    />
                </Card.Section>

                <Group pos={'relative'} top={-14}>
                    <Avatar src={avatarImg} radius={'xl'} size={'md'} className="tw-shadow-md"/>
                    <Text pos={'relative'} top={5} left={-6} weight={600} fz={'sm'}>{publisher}</Text>
                </Group>

                <Text size="sm" px={'md'}>{communication.message}
                </Text>
            </Card>
        )
    }

    return (
        <Carousel mx="auto" className="tw-w-full" withIndicators height={200} withControls={false}>
            {communications.map(function(communication) {
                return (
                    <Carousel.Slide key={communication.id}>
                        <CommunicationCard communication={communication} />
                    </Carousel.Slide>
                )
            })}
        </Carousel>
    )
}