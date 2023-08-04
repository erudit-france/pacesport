import Toast from "@/services/Toast";
import { ActionIcon, Avatar, Badge, Group, Loader, Table, Text } from "@mantine/core";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { BsCheckLg, BsFillGearFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import SponsoringOfferTypeBadge from "../SponsoringOfferTypeBadge";

export default function OffresTable({offres, refresh, fetching, editOffer}) {
    const StatusBadge = ({offer}) => {
        let color = ''
        let text = ''
        if (offer.validated == 1 && offer.status == 1 || offer.association == null && offer.validated == 1) {
            color = 'teal'
            text = 'Active'
        } else if (offer.validated == null && offer.status == 1 || offer.association == null && offer.validated == null) {
            color = 'yellow'
            text = 'En attente admin'
        } else if (offer.validated == null && offer.status == 0 || offer.validated == true) {
            color = 'gray'
            text = 'En attente association'
        } else if (offer.validated == false && offer.status == 0 || offer.validated == false) {
            color = 'red'
            text = 'Refusée'
        }
        return <Badge color={color} size="xs">{text}</Badge>
    }

    const acceptOffer = (id) => {
        fetch(`/api/sponsoring-offer-admin-accept`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({offer: id})
          })
            .then(res => res.json())
            .then(res => {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => { Toast.error('Erreur') })
    }

    const declineOffer = (id) => {
        fetch(`/api/sponsoring-offer-admin-decline`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({offer: id})
          })
            .then(res => res.json())
            .then(res => {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => { Toast.error('Erreur') })
    }

    const ths = (
        <tr>
          <th>Sponsor</th>
          <th>Association</th>
          <th className="tw-capitalize">état</th>
          <th>Contrat</th>
          <th>Catégorie</th>
          <th></th>
        </tr>
    )
    
    const rows = fetching 
        ? <tr><td colSpan={'100%'}><Loader mx={'auto'} my={'lg'} size={'sm'} color="gray"></Loader></td></tr>
        : offres.map((element) => (
        <tr key={element.id}>
            <td>
                <Group>
                    <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'}  src={`/uploads/${element.enseigne.avatar?.name}`} />
                    <Text fz={'sm'}>{element.enseigne.description}</Text>
                </Group>
            </td>
            <td>
                <Group>
                    <SponsoringOfferTypeBadge offer={element} />
                    {element.association 
                    ? <>
                        <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'}  src={`/uploads/${element.association?.avatar?.name}`} />
                        <Text fz={'sm'} weight={600}>{element.association.name}</Text>
                        </>
                    :   <>
                        <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'} />
                        </>
                    }
                    <Text fz={'sm'}>{element.description}</Text>
                </Group>
            </td>
            <td>
                <StatusBadge offer={element} />
            </td>
            <td>
                {element.contrat &&
                <ActionIcon color="violet" component="a" href={`/uploads/${element.contrat.name}`}>
                    <FaDownload />
                </ActionIcon>}
            </td>
            <td>{element.category?.label}</td>
            <td>
                <Group>
                    
                    <ActionIcon variant="light" color="red"
                                size={'lg'}
                                onClick={() => declineOffer(element.id) }><ImCross /></ActionIcon>
                    <ActionIcon variant="light"
                        size={'lg'}
                        color="teal"
                        onClick={() => acceptOffer(element.id) }><BsCheckLg /></ActionIcon>
                    <ActionIcon variant="light"
                        size={'lg'}
                        color="gray"
                        onClick={() => editOffer(element) }
                        ><BsFillGearFill /></ActionIcon>
                </Group>
            </td>
        </tr>
    ))

    return (
        <>
            <Table striped withColumnBorders fontSize={'sm'}>
                <thead>{ths}</thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    )
}