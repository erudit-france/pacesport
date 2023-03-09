import { Button, Table, Text } from "@mantine/core"
import Link from "next/link";

export default function OfferList() {
    const offers = [
        {type: 'maillot'},
        {type: 'téléphones'},
        {type: 'électronique'},
        {type: 'ameublement'},
        {type: 'maillot'}
    ]
    const rows = offers.map((offer, i) => (
        <tr key={i}>
          <td>{offer.type}</td>
          <td className="tw-flex tw-justify-end">
            <Link href={''}>
                <Button variant="filled" color={'dark'} size={'xs'} className="tw-bg-gray-800 tw-h-6 -tw-top-0.5">Détails</Button>
            </Link>
          </td>
        </tr>
      ));

    return (
        <>
            <div className="tw-bg-white tw-rounded-b-md tw-py-2">
                {offers.length == 0 
                    ? <Text align={'center'} className='tw-text-gray-700'>Aucune offre</Text>
                    :   <Table striped>
                        <tbody>
                            {rows}
                        </tbody>
                        </Table>
                }
            </div>
        </>
    )
}