import Toast from "@/services/Toast";
import fileUploader from "@/utils/fileUploader";

const { Box, Flex, ActionIcon, FileButton, Avatar } = require("@mantine/core");
const { useDisclosure } = require("@mantine/hooks");
const { getCookie } = require("cookies-next");
const { useState } = require("react");
const { RiImageAddFill } = require("react-icons/ri");
const { RxCross2, RxCheck } = require("react-icons/rx");

const HeroSection = ({avatar, editable = true}) => {
    const originalImage = '/uploads/'.concat(avatar);
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
        const formData = new FormData()
        formData.append('file', imageFile)
        fetch(`/api/file/upload`, {
            method: 'POST',
            type: 'cors',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token')}`
            }),
            body: formData
            })
            .then(res => res.json())
            .then(res => {
                if (res.data.code == 1) {
                    let body = new FormData();
                    body.append('filename', res.data.filename)
                    fetch(`/api/user/avatar`, {
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
            <div className='tw-flex tw-flex-col tw-justify-center'>
              <Box className="tw-relative tw-bg-white tw-rounded-full">
                <Avatar radius={9999} size={70} src={`${image}`}  alt="Logo Pace'sport" 
                    className='hadow-sm tw-bg-transparent tw-z-20'/>
                {editable &&
                    <LogoButtons />
                }
              </Box>
            </div>
        </header>
    )
}

export default HeroSection;