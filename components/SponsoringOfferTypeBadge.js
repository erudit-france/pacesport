import { Badge } from "@mantine/core"

export default function SponsoringOfferTypeBadge({offer}) {
    let type = 'Offre exclusive'
    let color = 'green'
    if (offer.type) {
        // Nationale
        if (offer.type == 'Nationale') {
            type = ''
            color = 'transparent'
            return (
                <span></span>
            )
        // Locale
        } else {
            type = 'Offre exclusive'
            color = 'green'
            return (
                <Badge size="xs" className="tw-font-normal tw-shadow-sm" variant="outline" color={color}>{type}</Badge>
            )
        }
    }
    return (
        <Badge size="xs" className="tw-font-normal tw-shadow-sm" variant="outline" color={color}>{type}</Badge>
    )
}