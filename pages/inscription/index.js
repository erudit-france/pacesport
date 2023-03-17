import { getCookie } from "cookies-next"
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

export default function Page() {
    const token = getCookie('token')
    const router = useRouter()
    // Mounting
    useEffect(() => {    
        if (token === undefined) {
            router.push('/login')
            return
        }
        fetch('/api/account/is-signup-complete', {
                headers: new Headers({
                    'type': 'cors',
                    'JWTAuthorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
            })})
            .then(res => res.json())
            .then(res => {
                if(res.data){
                    if(res.data.isSignupComplete === true) {
                        router.push('/profil')
                    }else{
                        router.push('/inscription/finaliser')
                    }
                }else{
                    router.push('/login')
                }
            })
        })

    return (
        <>
        </>
    )
}