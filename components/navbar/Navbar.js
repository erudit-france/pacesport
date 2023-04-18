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
import AppContext from '@/context/AppContext';

const NavParticulier = ({toggleMenu}) => {
    return (
        <>
            <NavbarLink border={true} toggleMenu={ toggleMenu } href={'/login/as'} name={<>Changer de rôle <VscSync className="tw-my-auto tw-ml-1" /></>} />
            <NavbarLink toggleMenu={ toggleMenu } href={'/'} name={'Accueil'} />
            <NavbarLink toggleMenu={ toggleMenu } href={''} name={<>Mon pace&lsquo;sport (carte)</>} />
            <NavbarLink toggleMenu={ toggleMenu } href={''} name={'Paramètres'} />
        </>
    )
}

const NavAssociation = ({toggleMenu}) => {
    return (
        <>
            <NavbarLink border={true} toggleMenu={ toggleMenu } href={'/login/as'} name={<>Changer de rôle <VscSync className="tw-my-auto tw-ml-1" /></>} />
            <NavbarLink toggleMenu={ toggleMenu } href={'/profil/association'} name={'Accueil'} />
            <NavbarLink toggleMenu={ toggleMenu } href={''} name={<>Mon pace&lsquo;sport (carte)</>} />
            <NavbarLink toggleMenu={ toggleMenu } href={'/sponsoring'} name={'Offres de partenariat'} />
            <NavbarLink toggleMenu={ toggleMenu } href={''} name={'Mon compte'} />
            <NavbarLink toggleMenu={ toggleMenu } href={''} name={'Invitations partenaires'} />
            <NavbarLink toggleMenu={ toggleMenu } href={''} name={<>Pace&lsquo;sport business <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/></>} />
            <NavbarLink toggleMenu={ toggleMenu } href={''} name={'Annuaire'} />
            <NavbarLink toggleMenu={ toggleMenu } href={'/gestion-fonds'} name={'Gestion de fonds'} />
            <NavbarLink toggleMenu={ toggleMenu } href={'/messages'} name={'Messagerie'} />
        </>
    )
}

const NavSponsor = ({toggleMenu}) => {
    return (
        <>
            <NavbarLink border={true} toggleMenu={ toggleMenu } href={'/login/as'} name={<>Changer de rôle <VscSync className="tw-my-auto tw-ml-1" /></>} />
            <NavbarLink toggleMenu={ toggleMenu } href={'/profil/sponsor'} name={'Accueil'} />
            <NavbarLink toggleMenu={ toggleMenu } href={''} name={'Mes cartes / partenariats actifs'} />
            <NavbarLink toggleMenu={ toggleMenu } href={'/sponsoring'} name={'Offres de partenariat'} />
            <NavbarLink toggleMenu={ toggleMenu } href={'/communication/add'} name={'Communication'} />
            <NavbarLink toggleMenu={ toggleMenu } href={''} name={'Annuaire'} />
            <NavbarLink toggleMenu={ toggleMenu } href={'/messages'} name={'Messagerie'} />
            <NavbarLink toggleMenu={ toggleMenu } href={'/gestion-fonds'} name={'Gestion de fonds'} />
            <NavbarLink toggleMenu={ toggleMenu } href={''} name={<>Pace&lsquo;sport business <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/></>} />
        </>
    )
}

export default function Navbar(){
    const context = useContext(AppContext)
    const role = context?.role;
    const [token, setToken] = useState(false);
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [lockScroll, setLockScroll] = useState(false);
    const closeBtnInitial = { opacity: 0, scale: 0 }
    const closeBtnAnimate = { opacity: 1, scale: 1 }
    const menuBgInitial = { transform: "translateX(-100%) translateY(-100%)"}
    const menuBgAnimate = { transform: "translateX(0%) translateY(0%)"}
    const menuInitial = { transform: "translateX(-100%) translateY(-100%)"}
    const menuAnimate = { transform: "translateX(0%) translateY(0%)"}

    useScrollLock(lockScroll);
    const toggleMenu = () => { 
        setOpen(!open)
        setLockScroll(!lockScroll)
    }
    useEffect(() => {
        setToken(getCookie('token'))
    }, []);
    
    const logout = () => {
        deleteCookie('token')
        router.push('/')
    }

    return (
        <>
            <div className='tw-max-h-screen tw-z-50 tw-fixed tw-top-0'>
                <motion.button className='tw-bg-white shadow-lg tw-p-2 tw-px-3 tw-rounded-r-lg tw-text-xl tw-fixed -tw-left-1 tw-top-10 tw-z-100'
                        onClick={toggleMenu}
                        initial={{transform: "translateX(0%)" }}
                        animate={ open ? { transform: "translateX(-100%)" } : {transform: "translateX(0%)" } }>
                    <HiMenuAlt2 className='tw-text-3xl' />
                </motion.button>

                {/* menu background */}
                <motion.div className='tw-bg-black tw-w-[117vw] tw-h-[37rem] tw-absolute -tw-left-10 tw-shadow-lg tw-z-100'
                    style={{ borderRadius: "0 0 63%"}}
                    initial={menuBgInitial}
                    animate={ open ? menuBgAnimate : menuBgInitial }
                    ></motion.div>
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
                            {role == 'particulier' && <NavParticulier toggleMenu={toggleMenu} />}
                            {role == 'sponsor' && <NavSponsor toggleMenu={toggleMenu} />}
                            {role == 'association' && <NavAssociation toggleMenu={toggleMenu} />}
                            {token &&
                                <motion.li 
                                className="tw-font-semibold tw-my-3.5 tw-text-gray-900 item">
                                        <Link href='' onClick={() => logout()} className={`tw-w-full tw-flex`}>Déconnexion</Link></motion.li>
                            }
                        </ul>
                    </div>

                </motion.div>

                <motion.button className='tw-fixed tw-rounded-full tw-shadow-xl tw-bg-white tw-p-4'
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