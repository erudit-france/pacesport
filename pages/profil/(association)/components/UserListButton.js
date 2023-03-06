import { useDisclosure } from '@mantine/hooks';
import { Avatar, Indicator, Modal } from '@mantine/core'
import { RxPerson } from 'react-icons/rx'

export default function UserListButton(){
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={opened} onClose={close} title="User list" centered>
                {/* Modal content */}
            </Modal>


            <Indicator zIndex={4} inline label="5" size={20} offset={4} color={'black'}>
                <Avatar radius={"lg"} size={'2.6rem'} onClick={open} 
                    className="hover:tw-cursor-pointer tw-bg-red-500">
                    <RxPerson size={'1.6rem'} color='black'  />
                </Avatar>
            </Indicator>
        </>
    )
}