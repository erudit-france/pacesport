import Toast from "@/services/Toast";
import { Accordion, Avatar, Box, Button, Flex, Paper, Text } from "@mantine/core";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AssociationPendingOffers({offers}) {
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
                        <Avatar radius={'xl'} className="tw-shadow-md" src={offer.img} alt={offer.description} />
                        {/* <Avatar radius={'xl'} className="tw-shadow-md" src={`/uploads/${offer.enseigne.avatar?.name}`} alt={offer.description} /> */}
                        <Text className='tw-my-auto tw-ml-2 tw-font-semibold'>{offer.title}</Text>
                    </Flex>
                </Accordion.Control>
            </Box>
        );
      }
    
    const items = offers == null || offers.length == 0 
        ? <Text align='center' fz={'xs'} color="dimmed">Aucune offre proposée</Text>
        : offers.map((offer) => (
            <Accordion.Item value={(offer.title)} key={offer.id}>
                <AccordionControl offer={offer} />
                <Accordion.Panel>
                    <Text className='tw-text-gray-900 tw-font-semibold tw-p-2' size="sm">{offer.description}</Text>
                    <Flex>
                        <Button className="tw-mx-auto tw-bg-red-600 hover:tw-bg-red-600" 
                            radius={'lg'} size="sm" variant="filled" 
                            onClick={() => declineOffer(offer.id)} disabled={loading}>Refuser</Button>
                        <Button className="tw-mx-auto tw-bg-lime-600 hover:tw-bg-teal-600" 
                            radius={'lg'} size="sm" variant="filled" 
                            onClick={() => acceptOffer(offer.id)} disabled={loading}>Valider</Button>
                    </Flex>
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