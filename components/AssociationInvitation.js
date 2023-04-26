import { Input, Loader, Notification } from "@mantine/core";
import { HiOutlineChevronDoubleRight } from 'react-icons/hi'
import { BsCheckLg } from 'react-icons/bs'
import { RxCross2 } from 'react-icons/rx'
import { useState } from "react";

export default function AssociationInvitation(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [message, setMessage] = useState(null);
    const invitationHandler = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            // handle error
                setMessage('Erreur pendant l\'envoi du mail')
                setError(true)
            // else
                // setMessage('Email Envoyé')

            // clear
            setTimeout(() => {
                clearNotification()
            }, 1800);
        }, 1800);
    }

    const clearNotification = () => {
        setLoading(false)
        setError(false)
        setMessage(null)
    }


    const InputButton = () =>  {
        return (
            <HiOutlineChevronDoubleRight size={'2rem'}
                onClick={invitationHandler}
                className='tw-bg-white hover:tw-bg-gray-50 tw-shadow-md tw-rounded-full
                            hover:tw-cursor-pointer tw-mr-1.5 tw-p-0.5 tw-left-1'/>
        )
    }

    return (
        <>
            {message && 
                <Notification className="tw-fixed tw-bottom-5 tw-right-5 tw-z-30" 
                    color={error ? "red" : "teal"} title="Envoi du mail"
                    icon={error ? <RxCross2 size="1.1rem" /> : <BsCheckLg size="1.1rem" />}>
                    {message}
                </Notification>
            }

            <Input.Wrapper className="tw-w-full focus:tw-outline-red-600">
                <Input
                    size={'md'}
                    rightSection={loading ? <Loader color="red" size={'xs'}/> : <InputButton />}
                    radius={'xl'}
                    placeholder="Inviter une association par mail"
                    />
            </Input.Wrapper>

        </>
    )
}