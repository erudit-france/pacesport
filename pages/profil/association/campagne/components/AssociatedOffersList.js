import { Group, Avatar, Text, Accordion, Box, ActionIcon, Flex } from '@mantine/core';
import { MdDelete } from 'react-icons/md'

function AccordionLabel({ label, image, description }) {
    return (
      <Group noWrap>
        <Avatar src={image} radius="xl" size="md" />
        <div>
          <Text size={'sm'}>{label}</Text>
        </div>
      </Group>
    );
}

function AccordionControl({offer, associatedOffers, setAssociatedOffers}) {
    const removeOffer = () => {
      setAssociatedOffers(
        associatedOffers.filter(function(o) { 
        return offer.id !== o.id 
    }))}

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Accordion.Control>
            <Flex>
                <Avatar src={offer.image} alt={offer.label} />
                <Text className='tw-my-auto tw-ml-2'>{offer.label}</Text>
            </Flex>
        </Accordion.Control>
        <ActionIcon size="lg" onClick={() => removeOffer()}>
          <MdDelete className='tw-text-red-800 tw-mr-2' size={18} />
        </ActionIcon>
      </Box>
    );
  }

export default function AssociatedOffersList(props) {
    const charactersList = props.associatedOffers
    const items = charactersList.map((item) => (
        <Accordion.Item value={item.id} key={item.id}>
            <AccordionControl offer={item} associatedOffers={props.associatedOffers} setAssociatedOffers={props.setAssociatedOffers} />
            <Accordion.Panel>
                <Text className='tw-text-gray-800' size="sm">{item.content}</Text>
            </Accordion.Panel>
        </Accordion.Item>
    ));


    return <Accordion className={props.className} chevronPosition="left" variant="contained">{items}</Accordion>;
}