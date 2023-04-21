import { ActionIcon, Avatar, BackgroundImage, Box, FileButton, Flex, Group } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import fileUploader from "@/utils/fileUploader"
import { useDisclosure } from "@mantine/hooks";
import { RxCheck, RxCross2 } from 'react-icons/rx';
import { getCookie } from 'cookies-next';
import Navbar from '@/components/navbar/Navbar';
import Toast from '@/services/Toast';
import hero from '@/public/hand-in-hand.jpg'
import Image from "next/image";



const HeroSection = ({avatar}) => {
    const originalImage = '/uploads/' + avatar;
    const [image, setImage] = useState(originalImage)
    const [editing, edit] = useDisclosure(false)
    const [imageFile, setImageFile] = useState(null)
    
    const uploadHandler = (file) => {
        const url = URL.createObjectURL(file)
        setImage(url)
        setImageFile(file)
        edit.open()
    }

    const resetImage = () => {
        setImage(originalImage)
    }

    const confirmEdit = () => {
        if (!imageFile) {
            Toast.error('Erreur pendant le téléchargement de l\'image')
            resetImage()
            edit.close()
            return
        }
        fileUploader(imageFile)
            .then((response) => {
                let body = new FormData();
                body.append('filename', response.data.filename)
                fetch(`/api/association/avatar`, {
                    method: 'POST',
                    type: 'cors',
                    headers: new Headers({
                      'JWTAuthorization': `Bearer ${getCookie('token')}`
                    }),
                    body: body
                  })
                  .then(res => res.json())
                    .then(res => {
                        res.data.code == 1 
                            ? Toast.success(res.data.message)
                            : Toast.error(res.data.message)
                    })
                    .catch((error) => { Toast.error('Erreur pendant le téléchargement de l\'image') })
            });
        edit.close()
    }

    const cancelEdit = () => {
        edit.close()
        resetImage()
    }

    const LogoButtons = () => {
        if (editing) {
            return (
                <Box className="tw-absolute tw-z-20 -tw-bottom-2 tw-w-full">
                    <Flex className='tw-w-full' justify={'space-between'}>
                        <ActionIcon onClick={cancelEdit} className='tw-bg-gray-200/50 tw-relative tw-right-4' color='dark' variant='light' radius={'xl'}><RxCross2 /></ActionIcon>
                        <ActionIcon onClick={confirmEdit} className='tw-bg-teal-300/50 tw-relative tw-left-4' color='teal' variant='light' radius={'xl'}><RxCheck /></ActionIcon>
                    </Flex>
                </Box>
            )
        }
        return (
            <Box className="tw-absolute tw-z-20 tw-bottom-0 tw-right-0">
                <FileButton onChange={uploadHandler} accept="image/png,image/jpeg">
                {(props) => <ActionIcon size={25} {...props} className="tw-bg-yellow-500/80 hover:tw-bg-yellow-500 tw-text-yellow-700 tw-rounded-full">
                        <RiImageAddFill size={15} className="tw-relative tw-right-[1px]"/>
                    </ActionIcon>}
                </FileButton>
            </Box>
        )
    }

    return (
        <header className='tw-flex tw-justify-center tw-h-36 tw-relative'>
            <Image className='tw-w-full tw-h-full tw-absolute tw-object-cover -tw-z-10 tw-blur-sm tw-scale-110' src={hero} placeholder='blur' alt="Hero image"/>
            <div className='tw-flex tw-flex-col tw-justify-center tw-z-30'>
                <Box className="tw-relative tw-rounded-full">
                    <Avatar radius={9999} size={70} src={`${image}`}  alt="Logo Pace'sport" 
                        className='hadow-sm tw-bg-transparent tw-z-20'/>
                    <LogoButtons />
                </Box>
            </div>
        </header>
    )
}

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <HeroSection avatar={children.props.avatar} />
            <main className="tw-bg-gradient-to-b tw-from-red-500 tw-to-red-700 tw-rounded-t-[2rem]"
                style={{ minHeight: 'calc(100vh - 144px)' }}>{children}</main>
        </>
    )
}