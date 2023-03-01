import { useState } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { GrClose } from "react-icons/gr";
import { BsLock } from "react-icons/bs";
import { motion } from "framer-motion"
import styles from '@/styles/Menu.module.css'
import Link from 'next/link';

export default function Navbar(){
    const [open, setOpen] = useState(false);
    const toggleMenu = () => { setOpen(!open)}
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
            <div className='tw-max-h-screen'>
                <motion.button className='bg-white shadow-sm btn tw-text-xl tw-absolute -tw-left-2 tw-top-5 tw-z-20'
                        onClick={toggleMenu}
                        initial={{transform: "translateX(0%)" }}
                        animate={ open ? { transform: "translateX(-100%)" } : {transform: "translateX(0%)" } }>
                    <HiMenuAlt2 className='tw-text-3xl' />
                </motion.button>

                {/* menu background */}
                <motion.div className='tw-bg-black tw-w-[117vw] tw-h-[29rem] tw-absolute -tw-left-10 tw-shadow-lg tw-z-20'
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
                            <motion.li className="tw-font-semibold tw-my-3.5 tw-text-gray-900 item" variants={menuItemVariants}><Link href="#" className='tw-block tw-w-full'>Mon compte</Link></motion.li>
                            <motion.li className="tw-font-semibold tw-my-3.5 tw-text-gray-900 item" variants={menuItemVariants}><Link href="#" className='tw-block tw-w-full'>Paramètres</Link></motion.li>
                            <motion.li className="tw-font-semibold tw-my-3.5 tw-text-gray-900 item" variants={menuItemVariants}><Link href="#" className='tw-block tw-w-full'>Invitations partenaires</Link></motion.li>
                            <motion.li className="tw-font-semibold tw-my-3.5 tw-text-gray-900 item" variants={menuItemVariants}><Link href="#" className='tw-block tw-w-full tw-flex'>Mon pace&lsquo;sport (carte) <BsLock className='tw-text-red-600 tw-my-auto tw-ml-1'/></Link></motion.li>
                            <motion.li className="tw-font-semibold tw-my-3.5 tw-text-gray-900 item" variants={menuItemVariants}><Link href="#" className='tw-block tw-w-full'>Offres de partenariat</Link></motion.li>
                            <motion.li className="tw-font-semibold tw-my-3.5 tw-text-gray-900 item" variants={menuItemVariants}><Link href="#" className='tw-block tw-w-full'>Messagerie</Link></motion.li>
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