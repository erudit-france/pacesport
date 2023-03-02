import { motion } from "framer-motion"
import Link from "next/link"

export default function NavbarLink({name, href}) {
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
                    <Link href={href} className='tw-block tw-w-full tw-flex'>{name}</Link></motion.li>
        </>

    )
}