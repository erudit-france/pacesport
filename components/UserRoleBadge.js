import { Badge } from "@mantine/core"

export default function UserRoleBadge({roles}) {
    let type = 'Utilisateur'
    let color = 'green'
    if (roles.includes('ROLE_ADMIN')) {
        type = 'Administrateur'
        color = 'cyan'
    }
    return (
        <Badge size="xs" className="tw-font-normal tw-shadow-sm" variant="outline" color={color}>{type}</Badge>
    )
}