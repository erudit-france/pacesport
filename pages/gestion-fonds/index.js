import { Button, Flex, Loader, Table, Text, TextInput } from "@mantine/core"
import { useDebouncedState } from "@mantine/hooks"
import Link from "next/link"
import { useState } from "react"
import { GoSearch } from "react-icons/go"
import { RxCross2 } from "react-icons/rx"
import Layout from "./layout"

export default function Page() {
    const dummyPaiementsList = [
        {
            date: '10 mars',
            data: [
                {name: 'Charles B', ammount: 5.99},
                {name: 'Tom J', ammount: 5.99},
                {name: 'Harry B', ammount: 5.99}
            ]
        },
        {
            date: '08 mars',
            data: [
                {name: 'Tom B', ammount: 5.99},
                {name: 'Charles B', ammount: 5.99},
                {name: 'Tom J', ammount: 5.99},
            ]
        },
        {
            date: '02 mars',
            data: [
                {name: 'Ludovic J', ammount: 5.99},
                {name: 'Pierre B', ammount: 5.99}
            ]
        },
    ]
    const [paiementsList, setPaimentsList] = useState(dummyPaiementsList)

    const totalValue = 350
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState(false)
    const clearSearch = () => {
        setSearch(false)
        setSearchInput('')
        setPaimentsList(dummyPaiementsList)
    }
    const handleSearch = () => {
        if (searchInput == '') return
        setTimeout(() => {
            setPaimentsList([])
            setLoading(false)
        }, 300);
        setLoading(true)
        setSearch(true)
        console.log('search input ', searchInput);
    }

    return (
        <>
            <div className="tw-bg-white tw-rounded-md tw-mx-1 tw-py-2">
                <Flex px={''} direction='column'>
                    <Flex justify='space-between'>
                        <Link href={''}><Button variant="filled" size="xs"
                            className="tw-bg-gray-200 tw-text-black
                            hover:tw-bg-gray-400 hover:tw-text-black" 
                            radius={'xl'}>Rapatrier sur mon compte</Button></Link>
                        <Link href={''}><Button variant="filled" size="xs"
                            className="tw-bg-gray-200 tw-text-black
                            hover:tw-bg-gray-400 hover:tw-text-black" 
                            radius={'xl'}>Ajouter un RIB</Button></Link>
                    </Flex>
                </Flex>
                
                <TextInput
                    className='focus:tw-border-red-600 tw-mx-4 tw-mt-3'
                    size={"sm"}
                    radius={"xl"}
                    value={searchInput}
                    rightSection={
                        loading 
                            ? <Loader size={'xs'} color='red' mr={'md'}/> 
                            :search 
                                ? <RxCross2 onClick={clearSearch} className='tw-mr-5 hover:tw-cursor-pointer'/> 
                                : <GoSearch onClick={handleSearch} className='tw-mr-5 hover:tw-cursor-pointer'/>}
                    onChange={(e) => setSearchInput(e.target.value)}
                />

                <section className="tw-bg-red-700/90 tw-my-4">
                    <Text className="tw-text-white tw-font-bold tw-text-center tw-py-3"><span>{totalValue}</span> €</Text>
                </section>

                <section>
                    <Table striped verticalSpacing="xs" fontSize="sm">
                        <tbody>
                                {paiementsList.length > 0 
                                    ? paiementsList.map(function(paimentsPerDay, i){
                                        return (
                                            <>
                                                <tr key={i} className="tw-text-center tw-font-semibold"><td colSpan={3}>{paimentsPerDay.date}</td></tr>
                                                {paimentsPerDay.data.map(function(onePaiement, j){
                                                    return (
                                                        <>
                                                            <tr key={j}>
                                                                <td>{onePaiement.name}</td>
                                                                <td>{onePaiement.ammount} €</td>
                                                                <td className="tw-flex tw-justify-end"><Link href=''>
                                                                    <Button variant="filled" color={"teal"}
                                                                        size='xs'
                                                                        className="tw-bg-teal-600
                                                                        hover:tw-bg-teal-800">
                                                                        Rembourser</Button></Link></td>
                                                            </tr>
                                                        </>
                                                    )
                                                })}
                                            </>
                                        )})
                                    : <Text py="lg" align="center">Aucun paiement</Text>
                                }
                        </tbody>
                    </Table>
                </section>
            </div>
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
}