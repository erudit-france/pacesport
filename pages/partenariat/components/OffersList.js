import { Group, Avatar, Text, Accordion, Box, ActionIcon, Flex, Paper, Button } from '@mantine/core';
import Link from 'next/link';
import { BsInfoSquare, BsPlusSquare } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md'

const charactersList = [
  {
    id: 'bender',
    image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    label: 'Bender Bending Rodríguez',
    content: "Bender Bending Rodríguez, (born September 4, 2996), designated Bending Unit 22, and commonly known as Bender, is a bending unit created by a division of MomCorp in Tijuana, Mexico, and his serial number is 2716057. His mugshot id number is 01473. He is Fry's best friend.",
  },

  {
    id: 'carol',
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'Carol Miller',
    content: "Carol Miller (born January 30, 2880), better known as Mom, is the evil chief executive officer and shareholder of 99.7% of Momcorp, one of the largest industrial conglomerates in the universe and the source of most of Earth's robots. She is also one of the main antagonists of the Futurama series.",
  },

  {
    id: 'homer',
    image: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
    label: 'Homer Simpson',
    content: 'Homer Jay Simpson (born May 12) is the main protagonist and one of the five main characters of The Simpsons series(or show). He is the spouse of Marge Simpson and father of Bart, Lisa and Maggie Simpson.',
  },
];

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

function AccordionControl({offer}) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Accordion.Control>
            <Flex>
                <Avatar src={offer.image} alt={offer.label} />
                <Text className='tw-my-auto tw-ml-2'>{offer.label}</Text>
            </Flex>
        </Accordion.Control>
        <ActionIcon size="lg" m={'md'}>
          <Button variant='filled' size='xs'
            className='tw-bg-gray-800 hover:tw-bg-gray-700 tw-mr-2 tw-p-1'>
              Détails</Button>
        </ActionIcon>
        </Box>
    );
  }

export default function OffersList(props) {
    const items = charactersList.length == 0 
        ? <Text align='center'>Aucune offre disponbile actuellement</Text>
        : charactersList.map((item) => (
        <Accordion.Item value={item.id} key={item.id}>
            <AccordionControl offer={item} />
            <Accordion.Panel>
                <Text className='tw-text-gray-800' size="sm">{item.content}</Text>
            </Accordion.Panel>
        </Accordion.Item>
    ));


    return (
      <Paper p={'xs'}>
        <Accordion className={props.className} chevronPosition="left" variant="contained">{items}</Accordion>
      </Paper>
    )
}