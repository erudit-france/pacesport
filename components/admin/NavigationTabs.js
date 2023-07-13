import { Tabs } from "@mantine/core"
import { FiUsers } from "react-icons/fi"
import { MdOutlineLocalOffer, MdOutlineStore } from "react-icons/md"

export default function NavigationTabs(props) {
    return (
        <Tabs.List px={'md'}>
            <Tabs.Tab p={'sm'} value="utilisateurs" icon={<FiUsers size={14} />}>Utilisateurs</Tabs.Tab>
            <Tabs.Tab p={'sm'} value="offres" icon={<MdOutlineLocalOffer size={14} />}>Offres</Tabs.Tab>
            <Tabs.Tab p={'sm'} value="comptes-pro" icon={<MdOutlineStore size={14} />}>Comptes pro</Tabs.Tab>
        </Tabs.List>
    )
}