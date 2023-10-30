import { ActionIcon, Avatar, Badge, Box, Button, FileButton, Image, Flex, Space, Group, Modal, Center, MultiSelect, ScrollArea, Select, Stack, Table, Tabs, Text, TextInput, Textarea, Title } from "@mantine/core";
import Head from "next/head";
import Layout from "./layout";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md";
import { getActiveOffers, getAssociationPacesportPendingOffers, getAssociationPendingOffers, getOffers } from "@/domain/repository/AdminRepository";
import { forwardRef, useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { BsCheckLg, BsFillGearFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/router";
import styles from '../../styles/ConditionsGeneralesVente.module.css';
import { getCookie } from "cookies-next";
import Toast from "@/services/Toast";
import { useForm } from "@mantine/form";
import { serialize } from "object-to-formdata";
import { getSponsoringOfferCategories } from "@/domain/repository/CategoryRepository";
import OffresTable from "@/components/admin/OffresTable";
import { getUser } from "@/domain/repository/UserRepository";
import { getAssociations } from "@/domain/repository/AssociationRepository";
import SponsoringOfferTypeBadge from "@/components/SponsoringOfferTypeBadge";
import moment from "moment/moment";

export default function Page(props) {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [open, setOpen] = useState(false)
    const [openCategory, setOpenCategory] = useState(false)
    const [offer, setOffer] = useState(null)
    const [offers, setOffers] = useState(props.offers)
    const [filename, setFileName] = useState(offer?.enseigne?.avatar?.name)
    const [selectedAssociations, setselectedAssociations] = useState([])
    const [originalSelectedAssociations, setOriginalSelectedAssociations] = useState([])
    const [logo, setLogo] = useState(null);
    const [categories, setCategories] = useState(props.categories.map((cat) => (
        { ...cat, value: (cat.id).toString() }
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
    const associationsSelect = props.associations.map((a) => {
        // ne pas pouvoir selectionner/deselectionné les associations existantes
        if (originalSelectedAssociations.includes(a.id)) {
            return (
                { ...a, label: a.name, value: a.id, disabled: true }
            )
        }
        return (
            { ...a, label: a.name, value: a.id }
        )
    })

    const editOffer = (offer) => {
        if (offer != null) {
            setFileName(null)
            setOffer(offer)
            // set association associations
            let associatedAssociations = offer.associations.map((a) => a.id)
            setselectedAssociations(associatedAssociations)
            setOriginalSelectedAssociations(associatedAssociations)
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

    const OfferDetails = ({ offer }) => {
        return (<>
            <Group mb={'sm'}>
                <Text weight={600} fz={'sm'}>Sponsor</Text>
                <Flex>
                    <Avatar className='tw-shadow-md' radius={'lg'} size={'sm'} src={`/uploads/${offer?.enseigne?.avatar?.name}`} />
                    <Text className="tw-ml-2" fz={'sm'}>{offer?.enseigne?.name}</Text>
                </Flex>
            </Group>
            <Group mb={'sm'}>
                <Text weight={600} fz={'sm'}>Date création</Text>
                <Text fz={'sm'}>{moment(offer?.createdAt).format('DD/MM/YYYY')}</Text>
            </Group>
            <Group mb={'sm'}>
                <Text weight={600} fz={'sm'}>Titre</Text>
                <Text fz={'sm'}>{offer?.title}</Text>
            </Group>
            <Group mb={'sm'}>
                <Text weight={600} fz={'sm'}>Type</Text>
                {offer &&
                    <SponsoringOfferTypeBadge offer={offer} />
                }
            </Group>
            <Flex mb={'sm'}>
                <Flex className='tw-h-full' direction={'column'} align={'start'} mr={'md'}>
                    <Text weight={600} fz={'sm'}>Association(s)</Text>
                </Flex>
                <Stack>
                    {offer &&
                        offer.associations.map((asso) => (
                            <Flex key={asso.id}>
                                <Avatar className='tw-shadow-md' radius={'lg'} size={'sm'} src={`/uploads/${asso.avatar?.name}`} />
                                <Text className="tw-ml-2" fz={'sm'}>{asso.name}</Text>
                            </Flex>
                        ))
                    }
                </Stack>
            </Flex>
        </>)
    }

    const submitCategory = (values) => {
        setLoading(true)
        let body = serialize(values)
        fetch(`/api/admin/sponsoring-offer-category`, {
            method: 'POST',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
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

        values = { ...values, offer: offer.id, selectedAssociations: selectedAssociations, logo:filename }
        setLoading(true)
        let body = serialize(values)
        console.log(values)
        console.log("fffff")
        fetch(`/api/admin/sponsoring-offer/association/add`, {
            method: 'POST',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
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

    const handleLogo = async (file) => {
        let logoFilename = null

        if (file) {
            const formData = new FormData()
            formData.append('file', file)

            let avatar = await fetch(`/api/file/upload`, {
              method: 'POST',
              type: 'cors',
              headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`
              }),
              body: formData
            })
            avatar = await avatar.json()
            if (avatar.code == 401) {
              push('/login')
              return
            }
            if (avatar.data.code != 1) {
                console.log("eeee")
              Toast.error('Erreur pendant le téléchargment du logo')
            } else {
                console.log("eeee3")
              logoFilename = avatar.data.filename
              setFileName(logoFilename);
              console.log(logoFilename)
            }
          }
          else if (boooo == TbRuler2) {
            console.log("ddd")
            logoFilename = "/uploads/chairs.png"
          }
    }

    const InfoField = ({ description, value, isEditable, onChange }) => {
        if (isEditable) {
            return (
                <>
                    <TextInput
                        description={description}
                        name={description.toLowerCase()}
                        value={value}
                        onChange={onChange}
                    />
                    <Space h={'md'} />
                </>
            );
        }
        return (
            <>
                <TextInput readOnly description={description} value={value} />
                <Space h={'md'} />
            </>
        );
    };

    const submitImage = (imagePath) => {
        if (!imagePath) {
          return; // Aucun chemin d'image spécifié
        }
        // Créez un élément de lien (a) temporaire pour le téléchargement
        const link = document.createElement('a');
        link.href = '/uploads/' + imagePath;
        link.download = 'nom-de-fichier.png'; // Vous pouvez personnaliser le nom du fichier
        link.target = '_blank'; // Ouvre le lien dans un nouvel onglet
      
        // Déclenchez un clic sur le lien pour lancer le téléchargement
        link.click();
      };

    const InfoSection = ({ title, data }) => (
        <>
            <Center><Text className={`tw-mt-8 ${styles.sectionTitle}`}>{title}</Text></Center>
            <div className={styles.infoGroup}>
                {Object.keys(data).map((key, index) => {
                    // Ignorer l'affichage de l'identifiant
                    if (key === 'id') return null;
                    if (key === 'createdAt') return null;
                    if (key === 'activeProposition') return null;
                    if (key === 'enseigne') return null;
                    if (key === 'validated') return null;
                    if (key === 'status') return null;
                    if (key === 'category') return null;
                    if (key === 'contrat') return null;
                    if (key === 'associations') return null;
                    if (key === 'association') return null;
                    if (key === 'type') return null;
                    if (key === 'title') return null;
                    if (key === 'images') return null;
                    // Si la clé est 'avatar' ou 'bagWorld', affiche une image
                    if (key === 'images') {
                        // return (
                        //     <div key={index}></div>
                        // );
                        var namePicture = "";
                        try {
                            namePicture = data[key]['name'];
                        } catch (error) {

                        }
                        return (
                            <div key={index}>
                                <Image src={"../public/uploads/" + namePicture} alt={key} width={50} height={50} />
                            </div>
                        );
                    }
                    let keyy = key;
                    if (key === 'nom') keyy = 'Nom';
                    if (key === 'prenom') keyy = 'Prénom';
                    if (key === 'address') keyy = 'Adresse';
                    if (key === 'telephone') keyy = 'Téléphone';
                    if (key === 'phone') keyy = 'Téléphone';
                    if (key === 'email') keyy = 'E-mail';
                    if (key === 'age') keyy = 'Âge';
                    if (key === 'name') keyy = 'Nom';
                    if (key === 'sexe') keyy = 'Sexe';
                    if (key === 'adresse') keyy = 'Adresse';
                    if (key === 'description') keyy = 'Description';
                    if (key === 'ville') keyy = 'Ville';
                    if (key === 'postal') keyy = 'Code postal';
                    return <InfoField key={index} description={keyy} value={data[key]} />;
                })}
            </div>
        </>
    );

    return (
        <>
            <Tabs.Panel value="offres" p={"md"}>
                <Flex justify={'space-between'} py={"sm"}>
                    <Title order={6} align="left">Offres ({offers.length})</Title>
                    <Select
                        styles={{
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
                title={<Title order={6}>Paramètres de l'offre</Title>}
                centered
                size={'95vw'}
            >
                <form onSubmit={offerForm.onSubmit((values) => submitOffer(values))} className="tw-p-4">
                    {offer &&
                        <OfferDetails offer={offer} />
                    }
                    <Textarea mt="sm" description={"Description de l'offre"} placeholder={offer?.description} radius="md" size="sm" withAsterisk
                        minRows={3}
                        mb={'md'}
                        {...offerForm.getInputProps('description')} />

                    <FileButton className="tw-cursor-pointer tw-my-2 tw-shadow-sm tw-shadow-white" onChange={handleLogo}
                        accept="image/png,image/jpeg">
                        {(props) => <Avatar {...props} mt={'md'} radius="xl" src={filename ? '/uploads/' + filename : '/uploads/' + offer?.enseigne?.avatar?.name} size={'lg'} />}
                    </FileButton>

                    {/* Bouton de téléchargement de l'image */}
                    {offer?.enseigne?.avatar?.name && (
                        <button type="button" onClick={() => submitImage(offer?.enseigne?.avatar?.name)}>
                            Télécharger l'image
                        </button>
                    )}

                    <Flex justify={'space-between'} my={'lg'}>
                        <Select
                            styles={{
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
                        {...form.getInputProps('category')} />
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
    const token = context.req.cookies['token_v3']
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
        })
    }
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
        })
    }
    )
    backgroundImage = await backgroundImage.json();

    let offersPendingPacesport = await getAssociationPacesportPendingOffers(token)
    let offersPendingAssociation = await getAssociationPendingOffers(token)
    let offers = await getOffers(token)
    let activeOffers = await getActiveOffers(token)
    let associations = await getAssociations(token)


    let categories = await getSponsoringOfferCategories(token)

    // // Pass data to the page via props
    return {
        props: {
            backgroundImage: backgroundImage.filename,
            avatar: avatar.filename,
            categories: JSON.parse(categories.data),
            offers: JSON.parse(offers.data),
            offersPendingPacesport: JSON.parse(offersPendingPacesport.data),
            offersPendingAssociation: JSON.parse(offersPendingAssociation.data),
            activeOffers: JSON.parse(activeOffers.data),
            associations: JSON.parse(associations.data)

        }
    }
}

Page.getLayout = function getLayout(page) {
    return (
        <Layout avatar={null}>{page}</Layout>
    )
}