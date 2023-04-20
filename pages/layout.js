import Image from "next/image";
import background from '@/public/doodle-pattern.png'
import { ActionIcon, BackgroundImage, FileButton } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import fileUploader from "@/utils/fileUploader"
import axios from "axios";


const HeroSection = ({avatar}) => {
    const originalImage = avatar;
    const [image, setImage] = useState(avatar);
    
    const uploadHandler = (file) => {
        const url = URL.createObjectURL(file)
        setImage(url)
        // const response = fileUploader(file);
    }

    return (
        <header className='tw-flex tw-justify-center tw-h-36 tw-relative'>
            <div className='tw-flex tw-flex-col tw-justify-center'>
              <div className="tw-relative">
                <Image src={avatar} height={70} width={70} alt="Logo Pace'sport" 
                    className='tw-rounded-full shadow-sm tw-bg-white tw-p-2 tw-z-20'/>
                <FileButton onChange={uploadHandler} accept="image/png,image/jpeg">
                  {(props) => <ActionIcon size={25} {...props} className="tw-absolute tw-z-10 tw-bottom-0 tw-right-0 tw-bg-yellow-500/80 hover:tw-bg-yellow-500 tw-text-yellow-700 tw-rounded-full">
                        <RiImageAddFill size={15} className="tw-relative tw-right-[1px]"/>
                    </ActionIcon>}
                </FileButton>
              </div>
            </div>
        </header>
    )
}

    
export default function Layout({children, avatar}){
    return (
        <main className="tw-w-screen tw-relative">
            <div className="tw-w-full tw-h-full">
                <HeroSection avatar={avatar} />
                <section className="tw-z-20">{children}</section>
            </div>
            <div className="tw-w-full tw-h-full tw-absolute tw-top-0 -tw-z-10">
                <BackgroundImage className="tw-h-full tw-opacity-10 tw-invert " 
                    src={background.src}/>
                <BackgroundImage className="tw-h-full tw-w-full tw-absolute tw-top-0 tw-opacity-80 -tw-z-20
                    tw-bg-gradient-to-b tw-from-white tw-from-10% tw-via-red-600 tw-via-40% tw-to-red-800 tw-to-90%" />
            </div>
        </main>
    )
}