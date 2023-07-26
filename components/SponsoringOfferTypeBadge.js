import { Badge } from "@mantine/core"

export default function SponsoringOfferTypeBadge({offer}) {
    let type = 'Locale'
    let color = 'green'
    if (offer.type) {
        // Nationale
        if (offer.type == 'Nationale') {
            type = 'Nationale'
            color = 'cyan'
        // Locale
        } else {
            type = 'Locale'
            color = 'green'
        }
    }
    return (
        <Badge size="xs" className="tw-font-normal tw-shadow-sm" variant="outline" color={color}>{type}</Badge>
    )
}