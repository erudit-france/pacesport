import { Accordion, Avatar, Box, Flex, Paper, Text } from "@mantine/core";
import SponsoringOfferTypeBadge from "./SponsoringOfferTypeBadge";

export default function AssociationAcceptedOffers({offers}) {
    const AccordionControl = ({offer}) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Accordion.Control>
                <Flex>
                    <Avatar radius={'xl'} className="tw-shadow-md" src={`/uploads/${offer.enseigne.avatar?.name}`} alt={offer.description} />
                    <Text className='tw-my-auto tw-ml-2 tw-font-semibold'>{offer.enseigne.description} <SponsoringOfferTypeBadge offer={offer}/>
                    </Text>
                </Flex>
            </Accordion.Control>
            {/* <ActionIcon size="lg" m={'md'}> */}
              {/* <Button variant='filled' size='xs'
                className='tw-bg-gray-800 hover:tw-bg-gray-700 tw-mr-2 tw-p-1'>
                  Détails</Button> */}
            {/* </ActionIcon> */}
            </Box>
        );
      }
    
    const items = offers == null || offers.length == 0 
        ? <Text align='center' fz={'xs'} color="dimmed">Aucune offre n&lsquo;a été validée</Text>
        : offers.map((offer) => (
        <Accordion.Item value={(offer.description)} key={offer.id}>
            <AccordionControl offer={offer} />
            <Accordion.Panel>
                <Text className='tw-text-gray-900 tw-font-semibold tw-p-2' size="sm">{offer.description}</Text>
            </Accordion.Panel>
        </Accordion.Item>
        ))

    return (
        <Paper p={'xs'}>
            <Accordion chevronPosition="left" variant="contained">
                {items}
            </Accordion>
        </Paper>
      )
}