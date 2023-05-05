import { Group, Avatar, Text, Accordion, Box, ActionIcon, Flex } from '@mantine/core';
import { MdDelete } from 'react-icons/md'

function AccordionControl({offer, associatedOffers, setAssociatedOffers}) {
    const logoUrl = offer.enseigne 
      ? '/uploads/' + offer.enseigne.logo
      : null
    const removeOffer = () => {
      setAssociatedOffers(
        associatedOffers.filter(function(o) { 
        return offer.id !== o.id 
    }))}

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Accordion.Control>
            <Flex>
                <Avatar src={logoUrl} alt={offer.title} radius="xl" />
                <Text className='tw-my-auto tw-ml-2'>{offer.title}</Text>
            </Flex>
        </Accordion.Control>
        <ActionIcon size="lg" onClick={() => removeOffer()}>
          <MdDelete className='tw-text-red-800 tw-mr-2' size={18} />
        </ActionIcon>
      </Box>
    );
  }

export default function AssociatedOffersList(props) {
    const offers = props.associatedOffers
    const items = offers
        ? offers.map((item) => (
        <Accordion.Item value={String(item.id)} key={item.id}>
            <AccordionControl offer={item} associatedOffers={props.associatedOffers} setAssociatedOffers={props.setAssociatedOffers} />
            <Accordion.Panel>
                <Text className='tw-text-gray-800' size="sm">{item.description}</Text>
            </Accordion.Panel>
        </Accordion.Item>))
        : <Text>Chargement</Text>

    return <Accordion className={props.className} chevronPosition="left" variant="contained">{items}</Accordion>;
}