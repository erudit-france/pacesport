import { Group, Avatar, Text, Accordion, Box, ActionIcon, Flex, Paper, Button } from '@mantine/core';
import Link from 'next/link';
import { BsInfoSquare, BsPlusSquare } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md'


function AccordionControl({offer}) {
    const logoUrl = offer.enseigne 
                      ? 'http://localhost:8080/uploads/' + offer.enseigne.logo
                      : null
    console.log('logoUrl', logoUrl)
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Accordion.Control>
            <Flex>
                <Avatar radius={'xl'} className="tw-shadow-md" src={logoUrl} alt={offer.title} />
                <Text className='tw-my-auto tw-ml-2'>{offer.title}</Text>
            </Flex>
        </Accordion.Control>
        <ActionIcon size="lg" m={'md'}>
          {/* <Button variant='filled' size='xs'
            className='tw-bg-gray-800 hover:tw-bg-gray-700 tw-mr-2 tw-p-1'>
              Détails</Button> */}
        </ActionIcon>
        </Box>
    );
  }

export default function OffersList(props) {
    const offers = props.offers

    const items = offers 
        ? offers.length == 0 
          ? <Text align='center'>Aucune offre disponbile actuellement</Text>
          : offers.map((item) => (
          <Accordion.Item value={String(item.id)} key={item.id}>
              <AccordionControl offer={item} />
              <Accordion.Panel>
                  <Text className='tw-text-gray-800' size="sm">{item.description}</Text>
              </Accordion.Panel>
          </Accordion.Item>
          ))
        : <Text>Chargement</Text>

    return (
      <Paper p={'xs'}>
        <Accordion className={props.className} chevronPosition="left" variant="contained">{items}</Accordion>
      </Paper>
    )
}