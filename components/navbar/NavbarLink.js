import { motion } from "framer-motion"
import Link from "next/link"

export default function NavbarLink({name, href, toggleMenu, border}) {
    const toggleMenuHandler = () => {
        setTimeout(() => {
            toggleMenu()
        }, 100);
    }
    const menuItemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    }

    return (
        <>
            <motion.li 
                className={`tw-font-semibold tw-my-3.5 tw-text-gray-900 item
                ${border ? 'tw-border-[1px] tw-rounded-3xl tw-border-gray-500 tw-py-1 tw-px-2.5' : ''}
                `}
                variants={menuItemVariants}>
                    <Link 
                        onClick={toggleMenuHandler} 
                        href={href} 
                        className={`tw-w-full tw-flex 
                                ${href == '' ? 'tw-text-gray-400' : ''}
                                ${border ? ' tw-relative -tw-top-0.5' : ''}
                                `}>
                            {name}</Link></motion.li>
        </>

    )
}