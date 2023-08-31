import { AspectRatio, Avatar, Badge, Button, Flex, Group, Image, Text } from "@mantine/core";
import moment from "moment";

export default function AssociationCardToAdd({card, addToCardList}){
    console.log('availablecard', card)
    const status = card.status ? card.status : 0;
    const statusString = (status) => { return status == 1 ? 'Active' : 'En attente' }

    return (
        <>
            <Flex className="tw-mb-7">
                    <Image
                        className="tw-rounded-xl tw-shadow-md"
                        width={180}
                        height={90}
                        src={`/uploads/${card.image?.name}`}
                        alt="Photo de campagne"
                    />
                    <Flex direction={'column'} ml={'lg'} justify={'space-around'}>
                        <Group mb={'sm'}>
                            <Avatar src={`/uploads/${card.association.avatar?.name}`} radius={'xl'} size={'sm'}/>
                            <Flex direction={'column'}>
                                <Text fz={'xs'} weight={800} className="tw-capitalize">{card.association.name}</Text>
                                <Text fz={'xs'} weight={600} className="tw-capitalize">{card.name}</Text>
                            </Flex>
                        </Group>
                        <Text color="dimmed" fz={'xs'}>{moment(card.startDate).format('DD/MM/YYYY')}</Text>
                        <Text fz={'xs'} color={"gray"} my={'sm'}>
                            Statut : 
                            <Badge className="tw-font-normal tw-uppercase tw-ml-3" 
                                size="sm" 
                                color={status == 1 ? 'teal' : 'indigo'}>
                                {statusString(status)}</Badge></Text>
                        <Button size="xs" className="tw-bg-gray-900 tw-text-gray-100 tw-text-xs tw-rounded-xl tw-px-10 tw-h-6
                                hover:tw-bg-black" onClick={() => addToCardList(card.id)} style="marginLeft:'10px'" >
                                Ajouter</Button>
                    </Flex>
            </Flex>
        </>
    )
    
}