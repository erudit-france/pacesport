import { ActionIcon, Avatar, Badge, Box, Button, Flex, Group, Modal, Select, Table, Tabs, Text, TextInput, Title } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getAssociationPacesportPendingOffers } from "@/domain/repository/CardOffersRepository";
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { BsCheckLg, BsFillGearFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { useForm } from "@mantine/form";
import { serialize } from "object-to-formdata";
import { getSponsoringOfferCategories } from "@/domain/repository/CategoryRepository";

export default function Page(props){
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [openCategory, setOpenCategory] = useState(false)
    const [offer, setOffer] = useState(null)
    const [offerCategory, setOfferCategory] = useState(null)
    const [offersPendingPacesport, setOffersPendingPacesport] = useState(props.offersPendingPacesport)
    const [categories, setCategories] = useState(props.categories.map((cat) => (
        {...cat, value: (cat.id).toString()}
    )))

    const router = useRouter()
    const refresh = () => { router.reload(window.location.pathname) }
    
    const editOffer = (offer) => {
        if (offer != null) {
            setOffer(offer)
            setOpen(true)
            return
        }
        setOffer(null)
        setOfferCategory(null)
        setOpen(false)
    }

    const form = useForm({
        initialValues: {
            category: '',
        },
        validate: {
            category: (value) => (value != '' ? null : 'Veuillez saisir un label'),
        },
    });

    const offerForm = useForm({
        initialValues: {
            category: '',
        },
        validate: {
        },
    });

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
          <th>Status</th>
          <th>Catégorie</th>
          <th></th>
        </tr>
    )
    
    const rows = offersPendingPacesport.map((element) => (
        <tr key={element.id}>
            <td>
                <Group>
                    <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'}  src={`/uploads/${element.enseigne.avatar?.name}`} />
                    <Text fz={'sm'}>{element.enseigne.description}</Text>
                </Group>
            </td>
            <td>
                <Group>
                    <Avatar className="tw-shadow-md" size={'sm'} radius={'xl'}  src={`/uploads/${element.association.avatar?.name}`} />
                    <Text fz={'sm'}>{element.description}</Text>
                </Group>
            </td>
            <td><Badge color="yellow" size="xs">En attente admin</Badge></td>
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

    const categoriesToSelectData = (categories) => {
        if (categories.length == null) return []
        return categories.map((cat) => (
            {
                ...cat,
                value: (cat.id).toString(),
            }
        ))
    }

    const submitCategory = (values) => {
        setLoading(true)
        let body = serialize(values)
        fetch(`/api/admin/sponsoring-offer-category`, {
            method: 'POST',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: body
          })
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                setCategories(categoriesToSelectData(JSON.parse(res.data.categories)))
                setLoading(false)
                form.reset()
                setOpenCategory(false)
            }
          })
        .catch((error) => { 
            Toast.error('Erreur pendant l\'enregistrement de la catégorie') 
            setLoading(false)
        })
    }

    const submitOffer = (values) => {
        values = {...values, offer: offer.id}
        setLoading(true)
        let body = serialize(values)
        fetch(`/api/admin/sponsoring-offer/update`, {
            method: 'POST',
            headers: new Headers({
              'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: body
          })
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                res.data.code == 1 
                    ? Toast.success(res.data.message)
                    : Toast.error(res.data.message)
                setLoading(false)
                editOffer(null)
                offerForm.reset()
            }
          })
        .catch((error) => { 
            Toast.error('Erreur pendant l\'enregistrement') 
            setLoading(false)
        })
    }
    
    return (
        <>
            <Tabs.Panel value="offres" p={"md"}>
            <Flex justify={'space-between'} py={"sm"}>
                <Title order={4} align="center">Offres</Title>
                <Select
                        styles={ {
                            root: { display: 'flex', flexDirection: 'row' },
                            label: { display: 'flex', alignSelf: 'center', marginRight: '5px' }
                        }}
                        data={[
                            { value: 'all', label: 'Tout' },
                            { value: 'pendingPacesport', label: 'En attente admin' },
                            { value: 'pendingAssociation', label: 'En attente association' },
                            { value: 'active', label: 'actives' }
                        ]}
                        disabled
                        defaultValue="pendingPacesport"
                        label="Filtre"
                        placeholder="Sélectionner"
                        size="sm"
                    />
            </Flex>
            <Table striped withColumnBorders>
                <thead>{ths}</thead>
                <tbody>{rows}</tbody>
            </Table>
            </Tabs.Panel>
            <Modal
                opened={open}
                onClose={() => editOffer(null)}
                title={<Title order={6}>Paramètres de l&lsquo;offre</Title>}
                centered
                size={'95vw'}
            >
                <form onSubmit={offerForm.onSubmit((values) => submitOffer(values))} className="tw-p-4">
                    <Flex justify={'space-between'}>
                        <Select
                            styles={ {
                                root: { display: 'flex', flexDirection: 'row' },
                                label: { display: 'flex', alignSelf: 'center', marginRight: '5px' }
                            }}
                            data={categories}
                            label="Catégorie"
                            placeholder="Sélectionner"
                            value={offer?.category ? 5 : 5}
                            size="sm"
                            {...offerForm.getInputProps('category')}
                            />
                        <Button size="sm" ml={'lg'} px={'sm'} className="tw-text-xs tw-bg-blue-600" 
                            leftIcon={<BsPlus className="tw-mr-0" size={12} />}
                            onClick={() => setOpenCategory(true)}>Ajouter catégorie</Button>
                    </Flex>
                    
                    <Flex justify={'flex-end'} mt={'xl'}>
                            <Button size="sm" ml={'lg'} px={'sm'} className="tw-text-xs" 
                                variant="outline"
                                onClick={() => setOpen(false)}
                                >Annuler</Button>
                            <Button size="sm" ml={'lg'} px={'sm'} className="tw-text-xs tw-bg-blue-600" 
                                type="submit"
                                disabled={loading}
                                >Valider</Button>
                    </Flex>
                </form>
            </Modal>
            <Modal
                opened={openCategory}
                onClose={() => setOpenCategory(false)}
                title={<Title order={6}>Ajouter une catégorie</Title>}
                centered
                size={'60vw'}
            >
                <form onSubmit={form.onSubmit((values) => submitCategory(values))} className="tw-p-3">
                    <TextInput description="Label"
                            placeholder="catégorie"
                            withAsterisk
                            {...form.getInputProps('category')}/>
                    <Flex justify={'flex-end'} mt={"md"}>
                        <Button size="sm" ml={'lg'} px={'sm'} 
                            type="submit"
                            className="tw-text-xs tw-bg-blue-600"
                            disabled={loading}
                            >Ajouter</Button>
                    </Flex>
                </form>
            </Modal>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']

    let avatar = await fetch(`${process.env.API_URL}/api/association/avatar`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
    )
    avatar = await avatar.json();
    if (avatar.code == 401) {
        return {
            redirect: {
            permanent: false,
            destination: "/login"
            }
        }
    }

    let backgroundImage = await fetch(`${process.env.API_URL}/api/association/background`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
    backgroundImage = await backgroundImage.json();

    let offersPendingPacesport = await getAssociationPacesportPendingOffers(token)
    let categories = await getSponsoringOfferCategories(token)

    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        offersPendingPacesport: JSON.parse(offersPendingPacesport.data),
        categories: JSON.parse(categories.data)
    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }