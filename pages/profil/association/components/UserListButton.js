import { useDisclosure } from '@mantine/hooks';
import { Avatar, Indicator, Modal } from '@mantine/core'
import { RxPerson } from 'react-icons/rx'
import Link from 'next/link';

export default function UserListButton({prev}){
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={opened} onClose={close} title="User list" centered>
                {/* Modal content */}
            </Modal>


            <Link href={`/annuaire?prev=${prev}`}>
                {/* <Indicator zIndex={4} inline size={20} offset={4} color={'black'}> */}
                    <Avatar radius={"lg"} size={'2.6rem'}
                        className="hover:tw-cursor-pointer tw-bg-red-500">
                        <RxPerson size={'1.6rem'} color='black'  />
                    </Avatar>
                {/* </Indicator> */}
            </Link>
        </>
    )
}