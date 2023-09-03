import { Avatar, Button, Flex, Group, Loader, Select, Space, Table, Text, TextInput, createStyles } from "@mantine/core"
import { useDebouncedState } from "@mantine/hooks"
import Link from "next/link"
import { useState } from "react"
import { getUser } from "@/domain/repository/UserRepository";
import { GoSearch } from "react-icons/go"
import { RxCross2 } from "react-icons/rx"
import Layout from "./layout"
import React from "react"
import { getAllOrder } from "@/domain/repository/RapatriementRepository";
import { BsArrowLeft, BsArrowUpShort } from 'react-icons/bs'
import { SlChart } from 'react-icons/sl'
import { FaChevronDown } from "react-icons/fa"
import { useRouter } from "next/router"
import { getCookie } from "cookies-next"
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import { forwardRef } from 'react'
import moment from "moment/moment"
import Toast from "@/services/Toast"
import { getCurrentRapatriement } from "@/domain/repository/AssociationRepository"

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

export default function Page(props) {
    const [rapatriement, setRapatriement] = useState(props.rapatriement)
    const router = useRouter()
    const rapatriementHandler = () => {
        setLoading(true)
        fetch(`/api/association/rapatriement`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            })
            .then(res => res.json())
            .then(res => {
                if (res.data.code == 1) {
                    Toast.success(res.data.message)
                    setRapatriement(res.data.rapatriement)
                } else {
                    Toast.error(res.data.message)
                }
                setLoading(false)
            })
            .catch((error) => { 
                Toast.error('Erreur pendant l\'envoi de la demande') 
                setLoading(false)
            })
    }

    const RapatriementButton = () => {
        if (!rapatriement) {
            return (
                <Button onClick={rapatriementHandler}
                disabled={loading}
                variant="filled" size="sm" 
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black" 
                radius={'xl'}>Soliciter un don</Button>
            )
        }
        return (
            <Button 
            disabled
            variant="filled" size="sm" 
            className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
            hover:tw-bg-gray-100 hover:tw-text-black" 
            radius={'xl'}>Demande envoyée {moment(rapatriement.createdAt).format('DD/MM/YYYY HH:mm')}</Button>
        )

    }

    const NavHeader = () => (
        <Flex justify='space-between' p={'md'}>
                    <Link href={props.id ? props.id : "/parametres"}>
        <Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-ml-5 tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button></Link>
            <RapatriementButton />
            {/* <Link href={'/profil/association/gestion-fonds/statistiques'}><Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black" 
                radius={'xl'}><SlChart /></Button></Link> */}
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
    const dummyList = null;
    let calculatedList = null;
    //const [calculatedList, setCalculatedList] = useState([...dummyList]);

    if(dummyList != null){
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
    };}

    const totalValue = 0
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
    }
    
    if(props.orders){
        const filteredData = props.orders.filter(item => 
            item.association && item.association.id === props.user.association.id && item.isComplete == true
          );
          console.log(props.rapatriement)
    calculatedList = filteredData.map((order, i) => (
        <React.Fragment key={i}>
            <tr className="tw-text-center tw-font-semibold tw-bg-gray-50"><td  colSpan={4}>{order.user.name}</td></tr>
                    <tr className="tw-bg-gray-200">
                        <td className={classes.td}>{order.user.nom + " " + order.user.prenom}</td>
                        <td className={`${classes.td}`}>{order.user.email}</td>
                        <td className={`${classes.td}`}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className={`${classes.td} tw-text-center`}>{(rapatriement.createdAt > order.createdAt ? 'Validé' : 'En attente')}</td>
                    </tr>
        </React.Fragment>
    ))}
    return (
        <>
            <NavHeader />
            <Space h='md' />
            
            {/* <TextInput
                className='focus:tw-border-[#d61515] tw-mx-4 tw-mt-3'
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
            /> */}

            <Text className="tw-bg-[#d61515] tw-my-4 
                    tw-text-white tw-font-bold tw-text-center tw-py-3">
                        <span>{calculatedList.length}</span> dons collectés</Text>

            {/* <FilterHeader  sort={sort} sortHandler={sortHandler} /> */}

            <section>
                <Table verticalSpacing="xs" fontSize="sm">
                    <tbody>
                            {calculatedList != null && calculatedList.length > 0 
                                ? calculatedList
                                : <Text py="lg" align="center">Aucun paiement</Text>
                            }
                    </tbody>
                </Table>
            </section>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    const id = context.query.prev
    let rapatriement = await getCurrentRapatriement(token)
    if (rapatriement.code == 401) {
        return {
            redirect: {
            permanent: false,
            destination: "/login"
            }
        }
    }
    let user = await getUser(token)
    let orders = await getAllOrder(token)
    orders = JSON.parse(orders.data)
    // // Pass data to the page via props
    return { props: { 
        rapatriement: JSON.parse(rapatriement.data),
        orders: orders,
        user: JSON.parse(user.data),
        id : id
    } }
  }

Page.getLayout = function getLayout(page) {
    return (
      <Layout text={'Centre de gestion'}>{page}</Layout>
    )
}