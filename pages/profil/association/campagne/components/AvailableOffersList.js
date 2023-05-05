import { Group, Avatar, Text, Accordion, Box, ActionIcon, Flex } from '@mantine/core';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { BsPlusSquare } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md'

function AccordionControl({offer, associatedOffers, setAssociatedOffers}) {
    const logoUrl = offer.enseigne 
      ? '/uploads/' + offer.enseigne.logo
      : null
    const alreadyAssociated = () => associatedOffers.find(x => x.id === offer.id) !== undefined;
    const addOffer = () => {
      setAssociatedOffers([...associatedOffers, offer]);
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Accordion.Control>
            <Flex>
                <Avatar src={logoUrl} alt={offer.title} radius="xl" />
                <Text className='tw-my-auto tw-ml-2'>{offer.title}</Text>
            </Flex>
        </Accordion.Control>
        {!alreadyAssociated() &&
            <ActionIcon size="lg" m={'md'} onClick={() => addOffer()}>
            <BsPlusSquare className={`tw-text-blue-600 hover:tw-text-white hover:tw-bg-blue-600 tw-rounded-[3px]`} size={18} />
            </ActionIcon>
        }
        </Box>
    );
  }

export default function AvailableOffersList(props) {
  const [loading, setLoading] = useState(false)
  const [offers, setOffers] = useState([])
  useEffect(() => {
    async function fetchData(){
        setLoading(true)
        const res = await axios(
            '/api/discount-offer',
            {headers: { 'JWTAuthorization': `Bearer ${getCookie('token')}`}}
        );

        setOffers(JSON.parse(res.data.data))
        setLoading(false)
      }
      fetchData()
  }, [offers]);

  const items = loading 
      ? <Text align='center'>Chargement</Text>
      : offers.length == 0 
        ? <Text align='center'>Aucune offre disponbile actuellement</Text>
        : offers.map((item) => (
        <Accordion.Item value={String(item.id)} key={item.id}>
            <AccordionControl offer={item} associatedOffers={props.associatedOffers} setAssociatedOffers={props.setAssociatedOffers} />
            <Accordion.Panel>
                <Text className='tw-text-gray-800' size="sm">{item.description}</Text>
            </Accordion.Panel>
        </Accordion.Item>
       
  ));


  return <Accordion className={props.className} chevronPosition="left" variant="contained">{items}</Accordion>;
}