import { upload } from "@/domain/repository/FileRepository";
import Toast from "@/services/Toast";
import { useRouter } from "next/router";
import { FiSettings } from "react-icons/fi";

const { Box, Flex, ActionIcon, FileButton, Avatar, Image, Group } = require("@mantine/core");
const { useDisclosure } = require("@mantine/hooks");
const { getCookie } = require("cookies-next");
const { useState } = require("react");
const { RiImageAddFill } = require("react-icons/ri");
const { RxCross2, RxCheck } = require("react-icons/rx");


const AvatarHeroSection = ({ user, avatar, background }) => {
    const router = useRouter()
    const originalImage = '/uploads/'.concat(avatar);
    const originalBackgroundImage = background ? '/uploads/' + background : '/chair.jpg'
    const [backgroundImage, setBackground] = useState(background ? '/uploads/' + background : '/chair.jpg')
    const [image, setImage] = useState(originalImage)
    const [editing, edit] = useDisclosure(false)
    const [editingBackground, editBackground] = useDisclosure(false)
    const [backgroundImageFile, setBackgroundImageFile] = useState(null)
    const [imageFile, setImageFile] = useState(null)

    const backgroundHandler = (file) => {
        const url = URL.createObjectURL(file)
        setBackground(url)
        setBackgroundImageFile(file)
        editBackground.open()
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
        const formData = new FormData()
        formData.append('file', imageFile)
        fetch(`/api/file/upload`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v2')}`
            }),
            body: formData
        })
            .then(res => res.json())
            .then(res => {
                if (res.data.code == 1) {
                    let body = new FormData();
                    body.append('filename', res.data.filename)
                    fetch(`/api/association/avatar`, {
                        method: 'POST',
                        type: 'cors',
                        headers: new Headers({
                            'JWTAuthorization': `Bearer ${getCookie('token_v2')}`
                        }),
                        body: body
                    })
                        .then(res => res.json())
                        .then(res => {
                            res.data.code == 1
                                ? Toast.success(res.data.message)
                                : Toast.error(res.data.message)
                        })
                        .catch((error) => {
                            Toast.error('Erreur pendant le téléchargement de l\'image')
                        })
                } else {
                    Toast.error(res.data.message)
                }
            })
            .catch((error) => {
                console.log('error', error)
                Toast.error('Erreur pendant le téléchargement de l\'image')
            })
        edit.close()
    }

    const cancelEdit = () => {
        edit.close()
        resetImage()
    }

    const cancelBackgroundEdit = () => {
        editBackground.close()
        setBackground(originalBackgroundImage)
    }

    const confirmBackgroundEdit = () => {
        if (!backgroundImageFile) {
            Toast.error('Erreur pendant le téléchargement de l\'image')
            cancelBackgroundEdit()
            return
        }
        const formData = new FormData()
        formData.append('file', backgroundImageFile)
        fetch(`/api/file/upload`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v2')}`
            }),
            body: formData
        })
            .then(res => res.json())
            .then(res => {
                if (res.data.code == 1) {
                    let body = new FormData();
                    body.append('filename', res.data.filename)
                    fetch(`/api/association/backgroundimage`, {
                        method: 'POST',
                        type: 'cors',
                        headers: new Headers({
                            'JWTAuthorization': `Bearer ${getCookie('token_v2')}`
                        }),
                        body: body
                    })
                        .then(res => res.json())
                        .then(res => {
                            res.data.code == 1
                                ? Toast.success(res.data.message)
                                : Toast.error(res.data.message)
                        })
                        .catch((error) => {
                            Toast.error('Erreur pendant le téléchargement de l\'image')
                        })
                } else {
                    Toast.error(res.data.message)
                }
            })
            .catch((error) => {
                console.log('error', error)
                Toast.error('Erreur pendant le téléchargement de l\'image')
            })
        editBackground.close()
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
                    {(props) => <ActionIcon size={25} {...props} className="tw-bg-gray-100/80 hover:tw-bg-gray-300 tw-text-gray-900 tw-rounded-full">
                        <RiImageAddFill size={15} className="tw-relative tw-right-[1px]" />
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
                {(props) => <ActionIcon {...props} radius={'xl'} size={'md'}
                    className="tw-bg-white tw-text-gray-900 tw-absolute tw-right-14 tw-top-16">
                    <RiImageAddFill />
                </ActionIcon>}
            </FileButton>
        )
    }

    const [isDarkMode, setIsDarkMode] = useState(false);
    const containerStyle = {
        filter: isDarkMode ? 'invert(1)' : 'none'
    };

    return (
        <header className='tw-flex tw-justify-center tw-h-32 tw-relative'>
            <Image className='tw-w-full tw-h-full tw-absolute tw-object-cover -tw-z-10 tw-blur-sm tw-scale-110' src={backgroundImage} placeholder='blur' alt="Hero image" />
            <div className='tw-flex tw-flex-col tw-justify-center tw-z-30'>
                <Box className="tw-rounded-full tw-relative tw-top-16 tw-shadow-md">
                    <Avatar radius={9999} size={80} src={`${image}`} alt="Logo Pace'sport" style={containerStyle}
                        className='hadow-sm tw-bg-transparent tw-z-20' />
                    <LogoButtons />
                </Box>
            </div>
            <ActionIcon component="a" href={`/parametres?prev=${router.pathname}`} radius={'xl'} size={'md'}
                className="tw-bg-white tw-text-gray-900 tw-absolute tw-right-4 tw-top-16">
                <FiSettings />
            </ActionIcon>
            <BackgroundButtons />
        </header>
    )
}

export default AvatarHeroSection;