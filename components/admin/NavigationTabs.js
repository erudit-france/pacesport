import { Tabs } from "@mantine/core"
import { BiTransferAlt } from "react-icons/bi"
import { FiUsers, FiUserCheck } from "react-icons/fi"  // Importez l'icône FiUserCheck
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md"
import { TbCreditCard } from "react-icons/tb"

export default function NavigationTabs(props) {
    return (
        <Tabs.List px={'md'}>
            <Tabs.Tab p={'sm'} value="offres" icon={<MdOutlineLocalOffer size={14} />}>Offres</Tabs.Tab>
            <Tabs.Tab p={'sm'} value="associations" icon={<MdOutlineStore size={14} />}>Associations</Tabs.Tab>
            <Tabs.Tab p={'sm'} value="partenaires" icon={<FiUserCheck size={14} />}>Partenaire</Tabs.Tab> {/* Changez l'icône ici */}
            <Tabs.Tab p={'sm'} value="utilisateurs" icon={<FiUsers size={14} />}>Utilisateurs</Tabs.Tab>
            <Tabs.Tab p={'sm'} value="carte" icon={<TbCreditCard size={14} />}>Carte</Tabs.Tab>
            <Tabs.Tab p={'sm'} value="rattrapages" icon={<BiTransferAlt size={14} />}>Rattrapages</Tabs.Tab>
            <Tabs.Tab p={'sm'} value="stats" icon={<BiTransferAlt size={14} />}>Stats</Tabs.Tab>
        </Tabs.List>
    )
}
