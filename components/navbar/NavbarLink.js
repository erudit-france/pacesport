import { motion } from "framer-motion"
import Link from "next/link"

export default function NavbarLink({name, href, toggleMenu}) {
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
                className="tw-font-semibold tw-my-3.5 tw-text-gray-900 item"
                variants={menuItemVariants}>
                    <Link onClick={toggleMenuHandler} href={href} className='tw-w-full tw-flex'>{name}</Link></motion.li>
        </>

    )
}