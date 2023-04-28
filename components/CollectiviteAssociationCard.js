import { ActionIcon, AspectRatio, Avatar, Badge, Box, Button, Center, CloseButton, Flex, Group, Image, SimpleGrid, Text, TextInput } from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import moment from "moment";
import { useId } from "react";
import { BsPercent } from "react-icons/bs";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IMaskInput } from 'react-imask';

export default function CollectiviteAssociationCard({card, setCardList, setProgress, removeFromCardList }){
    console.log('CollectiviteAssociationCard', card)
    const [count, handlers] = useCounter(0, { min: 0, max: 100 });
    const updateSelectedCards = (newCount) => {
        if (newCount == '') {
            newCount = 0
            handlers.set(0)
        }
        setTimeout(() => {
            handlers.set(parseInt(newCount))
        }, 100);
        setTimeout(() => {
            var c = {id: card.id, percentage: count}
            if (cardList.length > 0) {
                if (findByIndex() > -1) {
                    let idx = findByIndex()
                    let items = [...cardList];
                    let item = {...items[idx]}
                    item.percentage = count
                    items[idx] = item
                    console.log('item', item)
                    setCardList([...items])
                }else{
                    setCardList([...cardList, c])
                }
            }else{
                setCardList([...cardList, c])
            }
            updateProgress()
        }, 120);
}
    const updateProgress = () => {
        if (cardList.length > 0) {
            setProgress(cardList.map(item => item.percentage).reduce((prev, next) => prev + next))
        }
    }

    const findByIndex = () => {
        return cardList.findIndex(x => x.id == props.id)
    }
    const id = useId();
    const status = 1
    const statusString = (status) => { return status == 1 ? 'Active' : 'En attente' }

    return (
        <>
            <Flex className="tw-mb-3 tw-border-[1px] tw-border-gray-200 shadow-sm tw-p-1 tw-rounded-md" direction={'column'}>
                    <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
                        <Flex direction={'column'} ml={'lg'} justify={'space-around'}>
                                <Flex mb={'xs'}>
                                    <Center>
                                        <Avatar src={`/uploads/${card.image?.name}`}
                                            size={'sm'} radius={'xl'} className="tw-shadow-md tw-mr-2"/>
                                    </Center>
                                    <Flex direction={'column'} justify={'center'}> 
                                        <Text fz={'xs'} weight={800}>{card.association.name}</Text>
                                        <Text fz={'xs'} weight={600}>{card.name}</Text>
                                    </Flex>
                                </Flex>
                                <Text fz={'md'} weight={550} className="tw-capitalize">{card.name}</Text>
                                <Group>
                                    <Text fz={'xs'}>Date début: </Text>
                                    <Text color="dimmed" fz={'xs'}>{moment(card.startDate).format('DD/MM/YYYY')}</Text>
                                </Group>
                        </Flex>
                        <Box align={'center'} className="tw-flex-1">
                            <Group className="tw-relative tw-h-full" spacing={'xs'}>
                                <Center className="">
                                    <ActionIcon onClick={handlers.decrement} variant="default"><FiMinus size="1rem" /></ActionIcon>
                                    <TextInput
                                        styles={{
                                            input: {textAlign: 'center', padding: '5px'},
                                            rightSection: {width: '20px', color: 'gray'},
                                        }}
                                        rightSection={<BsPercent size={11} />}
                                        size="xs"
                                        w={50}
                                        max={100}
                                        component={IMaskInput}
                                        mask="000"
                                        id={id}
                                        value={count.toString()}
                                        onAccept={(value, mask) => {
                                            updateSelectedCards(value)
                                        }}
                                        placeholder="%"
                                    />
                                    <ActionIcon onClick={handlers.increment} variant="default"><FiPlus size="1rem" /></ActionIcon>
                                </Center>
                                <CloseButton size={'sm'} className="tw-bg-red-100 hover:tw-bg-red-300 tw-rounded-xl tw-absolute tw-right-1" 
                                    variant='light' color='red'
                                    onClick={() => removeFromCardList(card.id)}/>
                            </Group>
                        </Box>
                    </SimpleGrid>
            </Flex>
        </>
    )
}