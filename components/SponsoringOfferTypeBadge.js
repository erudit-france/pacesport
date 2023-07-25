import { Badge } from "@mantine/core"

export default function SponsoringOfferTypeBadge({offer}) {
    let type = 'Nationale'
    let color = 'cyan'
    if (offer.association) {
        type = 'Locale'
        color = 'green'
    }
    return (
        <Badge size="xs" className="tw-font-normal tw-shadow-sm" variant="outline" color={color}>{type}</Badge>
    )
}