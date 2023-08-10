import { ActionIcon, Avatar, Badge, Box, Button, Flex, Group, Modal, MultiSelect, ScrollArea, Select, Table, Tabs, Text, TextInput, Textarea, Title } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getActiveOffers, getAssociationPacesportPendingOffers, getAssociationPendingOffers, getOffers } from "@/domain/repository/AdminRepository";
import { forwardRef, useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { BsCheckLg, BsFillGearFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { useForm } from "@mantine/form";
import { serialize } from "object-to-formdata";
import { getSponsoringOfferCategories } from "@/domain/repository/CategoryRepository";
import OffresTable from "@/components/admin/OffresTable";
import { getUser } from "@/domain/repository/UserRepository";
import { getAssociations } from "@/domain/repository/AssociationRepository";

export default function Page(props){
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [open, setOpen] = useState(false)
    const [openCategory, setOpenCategory] = useState(false)
    const [offer, setOffer] = useState(null)
    const [offers, setOffers] = useState(props.offers)
    const [selectedAssociations, setselectedAssociations] = useState([])
    const [categories, setCategories] = useState(props.categories.map((cat) => (
        {...cat, value: (cat.id).toString()}
    )))

    const router = useRouter()
    const { push } = useRouter()
    const refresh = () => { router.reload(window.location.pathname) }
    const reloadFilter = async (val) => {
        setFetching(true)
        switch (val) {
            case 'all':
                setOffers(props.offers)
                break;
            case 'pendingAssociation':
                setOffers(props.offersPendingAssociation)
                break;
            case 'pendingPacesport':
                setOffers(props.offersPendingPacesport)
                break;
            case 'active':
                setOffers(props.activeOffers)
                break;
        }
        setFetching(false)
    }

    // add label to existing array
    const associationsSelect = props.associations.map((a) => (
        {...a, label: a.name, value: a.id}
    ))
    
    const editOffer = (offer) => {
        if (offer != null) {
            setOffer(offer)
            // set association associations
            let associatedAssociations = offer.associations.map((a) => a.id)
            setselectedAssociations(associatedAssociations)
            // set category
            if (offer.category) {
                offerForm.setFieldValue('category', offer.category.id)
            }
            
            offerForm.setValues({
                title: offer.title,
                description: offer.description,
            })
            setOpen(true)
            return
        }
        setOffer(null)
        setselectedAssociations([])
        offerForm.reset()
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
            title: offer ? offer.title : '',
            description: offer ? offer.description : ''
        },
        validate: {
        },
    });

    const categoriesToSelectData = (categories) => {
        if (categories.length == null) return []
        return categories.map((cat) => (
            {
                ...cat,
                value: (cat.id).toString(),
            }
        ))
    }

    const SelectItem = forwardRef(
        ({ avatar, description, ...others }, ref) => {
          return (
            <div ref={ref} {...others}>
              <Group noWrap>
                <Avatar radius={'xl'} src={avatar == null ? null : `/uploads/${avatar.name}`} />
                <div>
                  <Text size="sm">{description}</Text>
                </div>
              </Group>
            </div>
          )
        }
      );
    SelectItem.displayName = 'SelectItem';

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
        values = {...values, offer: offer.id, selectedAssociations: selectedAssociations}
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
                <Title order={6} align="left">Offres</Title>
                <Select
                        styles={ {
                            root: { display: 'flex', flexDirection: 'row' },
                            label: { display: 'flex', alignSelf: 'center', marginRight: '5px', fontSize: '13px' }
                        }}
                        data={[
                            { value: 'all', label: 'Tout' },
                            { value: 'pendingPacesport', label: 'En attente admin' },
                            { value: 'pendingAssociation', label: 'En attente association' },
                            { value: 'active', label: 'Actives' }
                        ]}
                        onChange={reloadFilter}
                        defaultValue="all"
                        label="Filtre"
                        placeholder="Sélectionner"
                        size="xs"
                    />
            </Flex>
            <ScrollArea className="tw-max-w-[100%]">
                <OffresTable 
                    offres={offers} refresh={refresh} fetching={fetching} 
                    editOffer={editOffer}
                    />
            </ScrollArea>
            </Tabs.Panel>
            <Modal
                opened={open}
                onClose={() => editOffer(null)}
                title={<Title order={6}>Paramètres de l&lsquo;offre</Title>}
                centered
                size={'95vw'}
            >
                <form onSubmit={offerForm.onSubmit((values) => submitOffer(values))} className="tw-p-4">
                    <TextInput mt="sm" description={"Titre de l'offre"} placeholder={offer?.title} radius="md" size="sm" withAsterisk
                        mb={'md'}
                        {...offerForm.getInputProps('title')}/>
                        
                    <Textarea mt="sm" description={"Description de l'offre"} placeholder={offer?.description} radius="md" size="sm" withAsterisk
                        minRows={3}
                        mb={'md'}
                        {...offerForm.getInputProps('description')}/>

                        
                    <MultiSelect
                        label="Association à soutenir"
                        placeholder="Choisir"
                        itemComponent={SelectItem}
                        data={associationsSelect}
                        onChange={setselectedAssociations}
                        value={selectedAssociations}
                        maxDropdownHeight={400}
                        mb={'lg'}
                        onDropdownClose={() => console.log('closing')}
                        />

                    <Flex justify={'space-between'} my={'lg'}>
                        <Select
                            styles={ {
                                root: { display: 'flex', flexDirection: 'row' },
                                label: { display: 'flex', alignSelf: 'center', marginRight: '5px' }
                            }}
                            data={categories}
                            label="Catégorie"
                            placeholder="Sélectionner"
                            value={offerForm.category}
                            size="sm"
                            {...offerForm.getInputProps('category')}
                            />
                        <Button size="sm" ml={'lg'} px={'sm'} className="tw-text-xs tw-bg-teal-400" 
                            leftIcon={<BsPlus className="tw-mr-0" size={12} />}
                            onClick={() => setOpenCategory(true)}>Nouvelle catégorie</Button>
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
    let user = await getUser(token)
    if (user.code == 401) {
        return {
            redirect: {
            permanent: false,
            destination: "/login/as"
            }
        }
    }
    user = JSON.parse(user.data)
    if (!user.roles.includes('ROLE_ADMIN')) {
        return {
            redirect: {
            permanent: false,
            destination: "/login/as"
            }
        }
    }
    const query = context.query
    const filter = query.filter

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
    let offersPendingAssociation = await getAssociationPendingOffers(token)
    let offers = await getOffers(token)
    let activeOffers = await getActiveOffers(token)
    let associations = await getAssociations(token)


    let categories = await getSponsoringOfferCategories(token)

    // // Pass data to the page via props
    return { props: {
        backgroundImage: backgroundImage.filename,
        avatar: avatar.filename,
        categories: JSON.parse(categories.data),
        offers: JSON.parse(offers.data),
        offersPendingPacesport: JSON.parse(offersPendingPacesport.data),
        offersPendingAssociation: JSON.parse(offersPendingAssociation.data),
        activeOffers: JSON.parse(activeOffers.data),
        associations: JSON.parse(associations.data)

    }}
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout avatar={null}>{page}</Layout>
    )
  }