import { useState } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { GrClose } from "react-icons/gr";
import { BsLock } from "react-icons/bs";
import { motion } from "framer-motion"
import styles from '@/styles/Menu.module.css'
import Link from 'next/link';
import { useScrollLock } from '@mantine/hooks';
import NavbarLink from './NavbarLink';

export default function Navbar(){
    const [open, setOpen] = useState(false);
    const [lockScroll, setLockScroll] = useState(false);
    useScrollLock(lockScroll);
    const toggleMenu = () => { 
        setOpen(!open)
        setLockScroll(!lockScroll)
    }
    const closeBtnInitial = { opacity: 0, scale: 0 }
    const closeBtnAnimate = { opacity: 1, scale: 1 }
    const menuBgInitial = { transform: "translateX(-100%) translateY(-100%)"}
    const menuBgAnimate = { transform: "translateX(0%) translateY(0%)"}
    const menuInitial = { transform: "translateX(-100%) translateY(-100%)"}
    const menuAnimate = { transform: "translateX(0%) translateY(0%)"}
    const menuItemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    }


    return (
        <>
            <div className='tw-max-h-screen tw-z-50 tw-absolute tw-top-0'>
                <motion.button className='tw-bg-white shadow-lg tw-p-2 tw-px-3 tw-rounded-r-lg tw-text-xl tw-fixed -tw-left-1 tw-top-5 tw-z-100'
                        onClick={toggleMenu}
                        initial={{transform: "translateX(0%)" }}
                        animate={ open ? { transform: "translateX(-100%)" } : {transform: "translateX(0%)" } }>
                    <HiMenuAlt2 className='tw-text-3xl' />
                </motion.button>

                {/* menu background */}
                <motion.div className='tw-bg-black tw-w-[117vw] tw-h-[29rem] tw-absolute -tw-left-10 tw-shadow-lg tw-z-100'
                    style={{ borderRadius: "0 0 63%"}}
                    initial={menuBgInitial}
                    animate={ open ? menuBgAnimate : menuBgInitial }
                    ></motion.div>
                {/* menu */}
                <motion.div className='tw-bg-gray-100 tw-w-screen tw-h-[29rem] tw-absolute tw-flex tw-justify-center tw-shadow-lg tw-z-20'
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
                            <NavbarLink toggleMenu={ toggleMenu } href={'/'} name={'Accueil'} />
                            <NavbarLink toggleMenu={ toggleMenu } href={'/login'} name={'Mon compte'} />
                            <NavbarLink toggleMenu={ toggleMenu } href={''} name={'Invitations partenaires'} />
                            <NavbarLink toggleMenu={ toggleMenu } href={''} name={<>Mon pace&lsquo;sport (carte)</>} />
                            <NavbarLink toggleMenu={ toggleMenu } href={''} name={<>Pace&lsquo;sport business <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/></>} />
                            <NavbarLink toggleMenu={ toggleMenu } href={''} name={'Annuaire'} />
                            <NavbarLink toggleMenu={ toggleMenu } href={'/gestion-fonds'} name={'Gestion de fonds'} />
                            <NavbarLink toggleMenu={ toggleMenu } href={'/partenariat'} name={'Offres de partenariat'} />
                            <NavbarLink toggleMenu={ toggleMenu } href={'/messages'} name={'Messagerie'} />
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