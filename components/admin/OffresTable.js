import Toast from "@/services/Toast";
import { ActionIcon, Avatar, Badge, Group, Loader, Table, Text } from "@mantine/core";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { BsCheckLg, BsClock, BsFillGearFill, BsTrash } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import SponsoringOfferTypeBadge from "../SponsoringOfferTypeBadge";

export default function OffresTable({ offres, refresh, fetching, editOffer }) {
    const StatusBadge = ({ offer }) => {
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
            body: JSON.stringify({ offer: id })
        })
            .then(res => res.json())
            .then(res => {
                res.data.code == 1
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => {
                console.error("Erreur détaillée:", error);
                Toast.error('Erreur')
            })
    }
    const deleteOffer = (id) => {

        // Demande de confirmation
        const userConfirmed = window.confirm("Voulez-vous vraiment supprimer cette offre? Cette action est irréversible.");

        if (!userConfirmed) {
            return; // Si l'utilisateur annule, ne faites rien.
        }

        fetch(`/api/sponsoring-offer-admin/delete`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({ offer: id })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                res.data.code == 1
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => {
                console.log(error)
                console.error("Erreur détaillée:", error);
                Toast.error('Erreur')
            })
    }


    const annulOfferAfterOneyears = (id) => {
        // Demande de confirmation
        const userConfirmed = window.confirm("Voulez-vous vraiment annuler cette offre? L'offre prendra fin après 1 an à partir de la date de validité initiale de l'offre.");

        if (!userConfirmed) {
            return; // Si l'utilisateur annule, ne faites rien.
        }

        fetch(`/api/sponsoring-offer-admin-decline-one-years`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({ offer: id })
        })
            .then(res => res.json())
            .then(res => {
                res.data.code == 1
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                refresh()
            })
            .catch((error) => {
                console.error("Erreur détaillée:", error);
                Toast.error('Erreur')
            })
    }
    const declineOffer = (id) => {
        fetch(`/api/sponsoring-offer-admin-decline`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: JSON.stringify({ offer: id })
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
            <th>Offre</th>
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
                        <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'} src={`/uploads/${element.enseigne.avatar?.name}`} />
                        <Text fz={'sm'}>{element.enseigne.description}</Text>
                    </Group>
                </td>
                <td>
                    <Group>
                        {element.associations.length == 1
                            ? <Avatar className='tw-shadow-md' radius={'xl'} src={`/uploads/${element.associations[0].avatar?.name}`} />
                            : element.associations.length > 1
                                ? <Avatar.Group spacing="sm">
                                    <Avatar className='tw-shadow-md' size={'sm'} radius={'xl'} src={`/uploads/${element.associations[0].avatar?.name}`} />
                                    <Avatar className='tw-shadow-md' size={'sm'} radius={'xl'} src={`/uploads/${element.associations[1].avatar?.name}`} />
                                    {element.associations.length > 2 &&
                                        <Avatar radius="xl" size={'sm'}>+{element.associations.length - 2}</Avatar>
                                    }
                                </Avatar.Group>
                                : <Avatar className='tw-shadow-md' radius={'xl'} src={null} />
                        }
                        <SponsoringOfferTypeBadge offer={element} />
                        <Text fz={'sm'} weight={600}>{element.title}</Text>
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
                            onClick={() => declineOffer(element.id)}><ImCross /></ActionIcon>
                        <ActionIcon variant="light"
                            size={'lg'}
                            color="teal"
                            onClick={() => acceptOffer(element.id)}><BsCheckLg /></ActionIcon>
                        <ActionIcon variant="light"
                            size={'lg'}
                            color="gray"
                            onClick={() => editOffer(element)}
                        >
                            <BsFillGearFill />
                        </ActionIcon>
                        <ActionIcon variant="light"
                            size={'lg'}
                            color="blue"
                            onClick={() => annulOfferAfterOneyears(element.id)}
                        >
                            <BsClock />
                        </ActionIcon>
                        <ActionIcon variant="light"
                            size={'lg'}
                            color="black"
                            onClick={() => deleteOffer(element.id)}
                        >
                            <BsTrash />
                        </ActionIcon>
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