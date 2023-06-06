import Toast from "@/services/Toast";
import fileUploader from "@/utils/fileUploader";
import { Group, Image } from "@mantine/core";
import { GoMegaphone } from "react-icons/go";
import { IoMdSettings } from "react-icons/io";
import { MdQrCode2 } from "react-icons/md";

const { Box, Flex, ActionIcon, FileButton, Avatar } = require("@mantine/core");
const { useDisclosure } = require("@mantine/hooks");
const { getCookie } = require("cookies-next");
const { useState } = require("react");
const { RiImageAddFill } = require("react-icons/ri");
const { RxCross2, RxCheck } = require("react-icons/rx");

const HeroSection = ({avatar, background}) => {
    const originalImage = '/uploads/'.concat(avatar);
    const [image, setImage] = useState(originalImage)
    const [editing, edit] = useDisclosure(false)
    const [imageFile, setImageFile] = useState(null)
    const originalBackgroundImage = background ? '/uploads/'+background : '/hand-in-hand.jpg'
    const [backgroundImage, setBackground] = useState(background ? '/uploads/'+background : '/hand-in-hand.jpg')
    const [backgroundImageFile, setBackgroundImageFile] = useState(null)
    const [editingBackground, editBackground] = useDisclosure(false)
    
    const backgroundHandler = (file) => {
        const url = URL.createObjectURL(file)
        setBackground(url)
        setBackgroundImageFile(file)
        editBackground.open()
    }

    const cancelBackgroundEdit = () => {
        editBackground.close()
        setBackground(originalBackgroundImage)
    }

    const confirmBackgroundEdit = () => {
        if (!backgroundImageFile) {
            Toast.error('Erreur pendant le téléchargement de l\'image')
            resetImage()
            edit.close()
            return
        }
        fileUploader(backgroundImageFile)
            .then((response) => {
                let body = new FormData();
                body.append('filename', response.data.filename)
                fetch(`/api/sponsor/backgroundimage`, {
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
                fetch(`/api/enseigne/avatar`, {
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

    const BackgroundButtons = () => {
        if (editingBackground) {
            return (
                <Group className='tw-absolute tw-right-14 tw-top-16'>
                    <ActionIcon onClick={cancelBackgroundEdit} className='tw-bg-gray-200/80 tw-relative tw-left-1' color='dark' variant='light' radius={'xl'}><RxCross2 /></ActionIcon>
                    <ActionIcon onClick={confirmBackgroundEdit} className='tw-bg-teal-300/60' color='teal' variant='outline' radius={'xl'}><RxCheck /></ActionIcon>
                </Group>
            )
        }
        return (
            <FileButton onChange={backgroundHandler} accept="image/png,image/jpeg">
                {(props) => <ActionIcon {...props}  radius={'xl'} size={'md'}
                    className="tw-bg-white tw-text-gray-900 tw-absolute tw-right-14 tw-top-16">
                    <RiImageAddFill />
                </ActionIcon>}
            </FileButton>
        )
    }

    return (
        <header className='tw-flex tw-justify-center tw-h-36 tw-relative'>
            <Image className='tw-w-full tw-h-full tw-absolute tw-object-cover -tw-z-10 tw-blur-sm tw-scale-110' fullwidth='true' src={backgroundImage} placeholder='blur' alt="Hero image"/>
            <div className='tw-flex tw-flex-col tw-justify-center tw-z-30'>
                <Box className="tw-relative tw-rounded-full">
                    <Avatar radius={9999} size={70} src={`${image}`}  alt="Logo Pace'sport" 
                        className='hadow-sm tw-bg-transparent tw-z-20'/>
                    <LogoButtons />
                </Box>
            </div>

            <Group className='tw-flex-col tw-absolute tw-right-3 tw-top-4 tw-z-20' spacing={'md'}>
                <ActionIcon 
                    className='tw-text-black tw-rounded-full tw-bg-white tw-shadow-sm'><IoMdSettings /></ActionIcon>
                <ActionIcon 
                    className='tw-text-black tw-rounded-full tw-bg-white tw-shadow-sm'><MdQrCode2 /></ActionIcon>
                <ActionIcon component='a' href='/communication/add?prev=/profil/sponsor' 
                    className='tw-text-black tw-rounded-full tw-bg-white tw-shadow-sm'><GoMegaphone /></ActionIcon>
            </Group>

            <BackgroundButtons />
        </header>
    )
}

export default HeroSection;