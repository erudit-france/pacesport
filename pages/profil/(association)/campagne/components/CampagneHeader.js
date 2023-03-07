import {Image as NextImage} from "next/image";
import hero from '@/public/hand-in-hand.jpg'
import userImage from '@/public/association.png'
import { Text, Image, Space } from "@mantine/core";


export default function CampagneHeader(){
    return (
        <header className='tw-flex tw-justify-center tw-h-52 tw-bg-gradient-to-br tw-from-slate-700 tw-to-gray-800
                tw-relative'>
            <div className='tw-flex tw-flex-col tw-justify-center tw-relative -tw-top-3'>
                {/* <NextImage src={userImage} height={70} width={70} alt="Image campagne" 
                        className='tw-rounded-full shadow-sm tw-bg-white tw-p-2 tw-mx-auto'/> */}
                <Image className="tw-shadow-md" radius={'lg'} width={220} height={120} src={null} alt="With default placeholder" withPlaceholder />
            </div>
        </header>
    )
}