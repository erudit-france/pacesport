import { Button, Dialog, Group, Text, TextInput } from "@mantine/core"

export default function RemainingOffersDialog({remainingOffers}) {
    
    return (
        <section className="card-remaining-offers-wrapper">
            <Dialog
                className="tw-bg-red-600/80 tw-border-0 tw-rounded-none"
                opened={true}
                position={{
                    bottom: 0
                }}
            >
                <Text size="sm" weight={400} color="white">
                    Il vous faut encore {remainingOffers} offres de sponsor pour valider la campagne
                </Text>

            </Dialog>
        </section>
    )
}