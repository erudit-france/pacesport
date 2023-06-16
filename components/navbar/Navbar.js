import { useEffect, useState } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { GrClose } from "react-icons/gr";
import { BsLock } from "react-icons/bs";
import { VscSync } from 'react-icons/vsc'
import { motion } from "framer-motion"
import Link from 'next/link';
import { useScrollLock } from '@mantine/hooks';
import NavbarLink from './NavbarLink';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { Avatar, Center, Flex, Overlay, Text } from '@mantine/core';
import { BiHome } from 'react-icons/bi';



export default function Navbar(props){
    const role = getCookie('role') || 'particulier';
    const [token, setToken] = useState(false);
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [lockScroll, setLockScroll] = useState(false);
    const closeBtnInitial = { opacity: 0, scale: 0 }
    const closeBtnAnimate = { opacity: 1, scale: 1 }
    const menuBgInitial = { transform: "translateX(-100%) translateY(-100%)"}
    const menuBgAnimate = { transform: "translateX(0%) translateY(0%)"}
    const menuInitial = { transform: "translateX(-100%) translateY(-100%)"}
    const menuAnimate = { transform: "translateX(0%) translateY(0%)"}
    const [isBusiness, setIsBusiness] = useState(null)
    const [subscriptionEndDate, setSubscriptionEndDate] = useState('')
    const logoSrc = isBusiness ? '/logo-business.png' : '/logo.png'

    useScrollLock(lockScroll);
    const toggleMenu = () => { 
        setOpen(!open)
        setLockScroll(!lockScroll)
    }
    useEffect(() => {
        setToken(getCookie('token'))
        
        fetch(`/api/user/hasActiveSubscription`, {
            method: 'GET',
            headers: new Headers({
            'JWTAuthorization': `Bearer ${getCookie('token')}`,
            'Content-Type': 'application/json'
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.date != null) {
                setIsBusiness(true)
                setSubscriptionEndDate(`Business jusqu'à '. ${moment(JSON.parse(res.data.end)).format('DD/MM/YYYY')}`)
            } else {
                setIsBusiness(false)
            }
        })
        .catch(err => console.log(err))
    }, []);

    const loginAsLink = 
        <>
            <Flex justify={'space-between'} align={'center'}>
                <NavbarLink 
                    border={true} toggleMenu={ toggleMenu } 
                    href={'/login/as'} 
                    name={<>Changer de rôle <VscSync className="tw-my-auto tw-ml-1" /></>} />
                    
                <NavbarLink 
                    border={true} toggleMenu={ toggleMenu } 
                    href={'/'} 
                    name={<><BiHome size={20} /></>} />
            
            </Flex>
        </>
    
    const NavParticulier = () => {
        return (
            <>
                {loginAsLink}
                <NavbarLink toggleMenu={ toggleMenu } href={'/'} name={<>Mon pace&lsquo;sport (carte)</>} />
                <NavbarLink toggleMenu={ toggleMenu } href={'/parametres?prev=/'} name={'Paramètres'} />
            </>
        )
    }
    
    const NavAssociation = () => {
        return (
            <>
                {loginAsLink}
                <NavbarLink toggleMenu={ toggleMenu } href={'/profil/association'} name={<>Mon pace&lsquo;sport (carte)</>} />
                <NavbarLink toggleMenu={ toggleMenu } href={'/sponsoring'} name={'Offres de partenariat'} />
                <NavbarLink toggleMenu={ toggleMenu } href={'/parametres?prev=/profil/association'} name={'Mon compte'} />
                <NavbarLink toggleMenu={ toggleMenu } href={''} name={'Invitations partenaires'} />
                <NavbarLink toggleMenu={ toggleMenu } href={`/annuaire?prev=${router.pathname}`} name={'Annuaire'} />
                <NavbarLink toggleMenu={ toggleMenu } href={`/gestion-fonds?prev=${router.pathname}`} name={'Gestion de fonds'} />
                <NavbarLink toggleMenu={ toggleMenu } href={`/messages?prev=${router.pathname}`} name={'Messagerie'} />
                {!isBusiness &&
                    <NavbarLink toggleMenu={ toggleMenu } href={'/profil/association/business'} name={<>Pace&lsquo;sport business <BsLock size={18} className='tw-text-gold-400 tw-my-auto tw-ml-1 tw-font-extrabold'/></>} />
                }
            </>
        )
    }
    
    const NavSponsor = () => {
        return (
            <>
                {loginAsLink}
                <NavbarLink toggleMenu={ toggleMenu } href={'/profil/sponsor/offers'} name={'Mes cartes / partenariats actifs'} />
                <NavbarLink toggleMenu={ toggleMenu } href={'/communication/add/sponsor'} name={'Communication'} />
                <NavbarLink toggleMenu={ toggleMenu } href={`/annuaire?prev=${router.pathname}`} name={'Annuaire'} />
                <NavbarLink toggleMenu={ toggleMenu } href={`/messages?prev=${router.pathname}`} name={'Messagerie'} />
                <NavbarLink toggleMenu={ toggleMenu } href={`/gestion-fonds?prev=${router.pathname}`} name={'Gestion de fonds'} />
                <NavbarLink toggleMenu={ toggleMenu } href={''} name={<>Pace&lsquo;sport business <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/></>} />
            </>
        )
    }

    return (
        <>
            <div className={`tw-h-screen ${open ? ' tw-w-screen' : ''} tw-fixed  tw-z-[900] tw-top-0`}>
                {open == true && <Overlay onClick={() => setOpen(false)} opacity={0.9} color={isBusiness ? '#850' : '#000'} zIndex={0} />}
                    <motion.button className='tw-bg-white tw-shadow-lg tw-p-2 tw-px-3 tw-rounded-r-lg tw-text-xl tw-fixed -tw-left-1 tw-top-10 tw-z-[999]'
                            onClick={toggleMenu}
                            initial={{transform: "translateX(0%)" }}
                            animate={ open ? { transform: "translateX(-100%)" } : {transform: "translateX(0%)" } }>
                        <HiMenuAlt2 className='tw-text-3xl' />
                    </motion.button>

                    {isBusiness && 
                        <>
                            <motion.div className='tw-bg-gold-400 tw-w-[127vw] tw-h-[38.5rem] tw-absolute -tw-left-10 tw-shadow-lg tw-z-100'
                                style={{ borderRadius: "0% 0% 63% 37% / 0% 34% 70% 3%"}}
                                initial={menuBgInitial}
                                animate={ open ? menuBgAnimate : menuBgInitial }
                                ></motion.div>

                            <motion.div className='tw-bg-black tw-w-[117vw] tw-h-[37rem] tw-absolute -tw-left-10 tw-shadow-lg tw-z-100'
                                style={{ borderRadius: "0 0 63%"}}
                                initial={menuBgInitial}
                                animate={ open ? menuBgAnimate : menuBgInitial }
                                ></motion.div>
                        </>
                    }
                    {!isBusiness &&
                    <>
                        <motion.div className='tw-bg-black tw-w-[117vw] tw-h-[40.5rem] tw-absolute -tw-left-10 tw-shadow-lg tw-z-100'
                            style={{ borderRadius: "0% 0% 63% 37% / 0% 34% 70% 3%"}}
                            initial={menuBgInitial}
                            animate={ open ? menuBgAnimate : menuBgInitial }
                            ></motion.div>
                        <motion.div className='tw-bg-gold-400 tw-w-[107vw] tw-h-[38rem] tw-absolute -tw-left-10 tw-shadow-lg tw-z-100'
                            style={{ borderRadius: "0 0 63%"}}
                            initial={menuBgInitial}
                            animate={ open ? menuBgAnimate : menuBgInitial }
                            ></motion.div>
                    </>
                    }
                    {/* menu */}
                    <motion.div className='tw-bg-gray-100 tw-w-screen tw-h-[36.5rem] tw-absolute tw-flex tw-justify-center tw-shadow-lg tw-z-20'
                        style={{ borderRadius: "0 0 70%"}}
                        initial={menuInitial}
                        animate={ open ? menuAnimate : menuInitial }
                        transition={{ delay: .1 }}
                        variants={{ 
                            visible: {
                                transition: {
                                    delayChildren: 0.3,
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                        >
                        <div className='tw-flex tw-flex-col tw-justify-center'>
                            <ul className='tw-relative -tw-top-4'>
                                <Center mb={'md'}>
                                    <Avatar src={isBusiness == true ? `/logo-business.png` : '/logo.png'} size={70}/>
                                </Center>
                                { !['particulier', 'sponsor/partenaire', 'association'].includes(role)
                                    && <NavParticulier toggleMenu={toggleMenu} />
                                }
                                {role == 'particulier' && <NavParticulier toggleMenu={toggleMenu} />}
                                {role == 'sponsor/partenaire' && <NavSponsor toggleMenu={toggleMenu} />}
                                {role == 'association' && <NavAssociation toggleMenu={toggleMenu} />}
                            </ul>
                        </div>

                    </motion.div>

                    <motion.button className='tw-fixed tw-rounded-full tw-shadow-xl tw-bg-white tw-p-4 tw-z-[300]'
                            style={{ left: "calc(50% - 24px)", top: "90vh" }}
                            onClick={toggleMenu}
                            initial={ closeBtnInitial }
                            animate={ open ? closeBtnAnimate : closeBtnInitial }
                            transition={{ delay: .2 }}>
                        <GrClose />
                    </motion.button>
            </div>
        </>
    )
}
