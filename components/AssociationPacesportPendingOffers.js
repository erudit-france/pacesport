import Toast from "@/services/Toast";
import { Accordion, ActionIcon, Avatar, Box, Button, Flex, Paper, Stack, Text } from "@mantine/core";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import SponsoringOfferTypeBadge from "./SponsoringOfferTypeBadge";

export default function AssociationPacesportPendingOffers({offers}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const refresh = () => { router.reload(window.location.pathname) }

    const acceptOffer = (id) => {
        setLoading(true)
        fetch(`/api/discountoffer/accept`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({discountOfferId: id})
          })
            .then(res => res.json())
            .then(res => {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => { Toast.error('Erreur') })
        setLoading(false)
    }

    const declineOffer = (id) => {
        setLoading(true)
        fetch(`/api/discountoffer/decline`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({discountOfferId: id})
          })
            .then(res => res.json())
            .then(res => {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => { Toast.error('Erreur') })
        setLoading(false)
    }

    const AccordionControl = ({offer}) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Accordion.Control>
                    <Flex>
                        <Avatar radius={'xl'} className="tw-shadow-md" src={`/uploads/${offer.enseigne?.avatar?.name}`} alt={offer.description} />
                        <Stack spacing={'xs'}>
                            <Text fz={'sm'} className='tw-my-auto tw-ml-2 tw-font-semibold'>{offer.enseigne?.name} <SponsoringOfferTypeBadge offer={offer}/>
                            </Text>
                            <Text fz={'sm'} className='tw-text-gray-900 tw-font-semibold tw-p-2' size="sm">{offer.title}</Text>
                        </Stack>
                    </Flex>
                </Accordion.Control>
            </Box>
        );
      }
    
    const items = offers == null || offers.length == 0 
        ? <Text align='center' fz={'xs'} color="dimmed">Aucune offre proposée</Text>
        : offers.map((offer) => (
            <Accordion.Item value={(offer.description)} key={offer.id}>
                <AccordionControl offer={offer} />
                <Accordion.Panel>
                    <Flex justify={'space-between'}>
                        <Text className='tw-text-gray-900 tw-p-2' size="sm">{offer.description}</Text>
                        <Flex direction={'column'} justify={'space-between'}>
                            <ActionIcon variant="light" color="red" mb={'md'}
                                size={'lg'}
                                onClick={() => declineOffer(offer?.id)} disabled={loading}><ImCross /></ActionIcon>
                        </Flex>
                    </Flex>
                </Accordion.Panel>
            </Accordion.Item>
        ))

    return (
        <Paper p={'xs'}>
            <Accordion variant="contained">
                {items}
            </Accordion>
        </Paper>
      )
}