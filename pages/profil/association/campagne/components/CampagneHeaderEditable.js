import {Image as NextImage} from "next/image";
import hero from '@/public/hand-in-hand.jpg'
import userImage from '@/public/association.png'
import { Text, Image, Space, ActionIcon, FileButton } from "@mantine/core";
import { RiImageAddFill } from 'react-icons/ri'
import { useState } from "react";


export default function CampagneHeaderEditable(){
    const [image, setImage] = useState(null);
    const uploadHandler = (file) => {
        const url = URL.createObjectURL(file)
        setImage(url)
        console.log('image', image)
    }

    return (
        <header className='tw-flex tw-justify-center tw-h-52 tw-bg-gradient-to-br tw-from-gray-800 tw-to-black/90
                tw-relative'>
            <div className='tw-flex tw-flex-col tw-justify-center -tw-top-3'>
                <div className="tw-relative">
                    <FileButton onChange={uploadHandler} accept="image/png,image/jpeg">
                    {(props) => <ActionIcon {...props} className="tw-absolute tw-z-10 tw-bottom-2 tw-right-2 tw-bg-yellow-500/70 hover:tw-bg-yellow-500 tw-text-yellow-700 tw-rounded-full">
                            <RiImageAddFill className="tw-relative tw-right-[1px]"/>
                        </ActionIcon>
                    }
                    </FileButton>
                    <Image className="tw-shadow-md" radius={'lg'} width={220} height={120} src={image} alt="With default placeholder" withPlaceholder/>
                </div>
            </div>
        </header>
    )
}