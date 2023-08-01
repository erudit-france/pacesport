import { Avatar, Button, Flex, Group, Loader, Select, Space, Table, Text, TextInput, createStyles } from "@mantine/core"
import { useDebouncedState } from "@mantine/hooks"
import Link from "next/link"
import { useState } from "react"
import { GoSearch } from "react-icons/go"
import { RxCross2 } from "react-icons/rx"
import Layout from "./layout"
import React from "react"
import { BsArrowLeft, BsArrowUpShort } from 'react-icons/bs'
import { SlChart } from 'react-icons/sl'
import { FaChevronDown } from "react-icons/fa"
import { useRouter } from "next/router"
import { getCookie } from "cookies-next"
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import { forwardRef } from 'react'

const useStyles = createStyles((theme) => ({
    td: {
      padding: '5px 10px !important',
    }
}))


const SelectItem = forwardRef(
    ({label, icon, ...others}, ref) => (
      <div ref={ref} {...others}>
        <Flex justify={'space-between'}>
            <Text size="sm">{label}</Text>
            {icon}
        </Flex>
      </div>
    )
  );

  SelectItem.displayName = 'SelectItem';

const FilterHeader = ({ sort, sortHandler }) => (
    <Flex justify='flex-end' px={'md'} py={'md'}>
        {/* <Text>Trier par</Text>
        <Button variant="filled" size="xs"
            className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
            hover:tw-bg-gray-100 hover:tw-text-black" 
            radius={'xl'}>Cartes</Button>
        <Button variant="filled" size="xs"
            className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
            hover:tw-bg-gray-100 hover:tw-text-black" 
            radius={'xl'}>Offres</Button> */}
        <Select placeholder="Trier"
                rightSection={<FaChevronDown/>}
                size="xs"
                radius={'xl'}
                value={sort}
                onChange={sortHandler}
                defaultValue="dateDESC"
                itemComponent={SelectItem}
                data={[
                    { value: 'dateASC', label: 'Date', icon: <AiOutlineArrowUp size={18}/> },
                    { value: 'dateDESC', label: 'Date', icon: <AiOutlineArrowDown size={18}/>},
                    { value: 'prixASC', label: 'Prix', icon: <AiOutlineArrowUp size={18}/> },
                    { value: 'prixDESC', label: 'Prix', icon: <AiOutlineArrowDown size={18}/>}
                ]}
            />
    </Flex>
)

export default function Page() {
    const router = useRouter()
    const prev = router.query?.prev || ''

    const NavHeader = () => (
        <Flex justify='space-between' p={'md'}>
            <Link href={prev}><Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button></Link>
            <Link href={''}><Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black" 
                radius={'xl'}>Rapatrier sur mon compte</Button></Link>
            <Link href={'/gestion-fonds/statistiques'}><Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black" 
                radius={'xl'}><SlChart /></Button></Link>
        </Flex>
    )
    
    const [sort, setSort] = useState(null);
    const sortHandler = (v) => {
        setSort(v)
        
        if (v == 'dateDESC') {
            setCalculatedList(sortByDate('DESC'))
        } 
        if (v == 'dateASC') {
            console.log('sort == dateASC', sort)
            setCalculatedList(sortByDate('ASC'))
        }
    }
    const { classes } = useStyles();
    const dummyList = [
        {
            date: '2023-03-10',
            data: [
                {name: 'Charles B', ammount: 5.99} 
            ]
        },
        {
            date: '2023-03-10',
            data: [
                {name: 'ChTom J', ammount: 10.99} 
            ]
        },
        {
            date: '2023-03-10',
            data: [
                {name: 'Harry B', ammount: 5.99} 
            ]
        },
        {
            date: '2023-03-08',
            data: [
                {name: 'Charles B', ammount: 5.99} 
            ]
        },
        {
            date: '2023-03-08',
            data: [
                {name: 'Tom B', ammount: 5.99} 
            ]
        },
        {
            date: '2023-03-08',
            data: [
                {name: 'Tom J', ammount: 17.00} 
            ]
        },
        {
            date: '2023-03-02',
            data: [
                {name: 'Ludovic J', ammount: 21.99} 
            ]
        },
        {
            date: '2023-03-02',
            data: [
                {name: 'Pierre B', ammount: 15.99} 
            ]
        }
    ]

    const [calculatedList, setCalculatedList] = useState([...dummyList]);

    let sortByDate  = (dir) => {
     let list = dummyList.reduce((acc, current) => {
        const date = current.date;
        const found = acc.find(item => item.date === date);
        
        if (!found) {
            acc.push({
                date: date,
                data: current.data
            });
        } else {
            found.data = found.data.concat(current.data);
        }
        return acc;
        }, [])
        if (dir == 'ASC') {
            list =  list.reverse()
        }
        return list;
    };

    const totalValue = 350
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState(false)
    const clearSearch = () => {
        setSearch(false)
        setSearchInput('')
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

    const rows = calculatedList.map((paimentsPerDay, i) => (
        <React.Fragment key={i}>
            <tr className="tw-text-center tw-font-semibold tw-bg-gray-50"><td  colSpan={3}>{paimentsPerDay.date}</td></tr>
            {paimentsPerDay.data.map((onePaiement, j) => (
                <React.Fragment key={j}>
                    <tr className="tw-bg-gray-200">
                        <td className={classes.td}>{onePaiement.name}</td>
                        <td className={`${classes.td} tw-text-center`}>{onePaiement.ammount} €</td>
                        <td className={`${classes.td} tw-flex tw-justify-end`}><Link href=''>
                            <Button variant="filled" color={"teal"}
                                size='xs'
                                className="tw-bg-gray-800
                                hover:tw-bg-gray-900">
                                Détails</Button></Link></td>
                    </tr>
                </React.Fragment>
                )
            )}
        </React.Fragment>
    ))

    return (
        <>
            <NavHeader />
            <Space h='md' />
            
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

            <Text className="tw-bg-red-700/90 tw-my-4 
                    tw-text-white tw-font-bold tw-text-center tw-py-3">
                        <span>{totalValue}</span> €</Text>

            <FilterHeader  sort={sort} sortHandler={sortHandler} />

            <section>
                <Table verticalSpacing="xs" fontSize="sm">
                    <tbody>
                            {calculatedList.length > 0 
                                ? rows
                                : <Text py="lg" align="center">Aucun paiement</Text>
                            }
                    </tbody>
                </Table>
            </section>
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout text={'Gestion des fonds'}>{page}</Layout>
    )
}