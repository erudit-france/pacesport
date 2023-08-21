import Image from "next/image";
import hero from '../../../public/stadium_chairs.jpg'
import userImage from '../../../public/association.png'


export default function LoggedInUserHero(){
    return (
        <header className='tw-flex tw-justify-center tw-h-36 tw-relative'>
            <div className='tw-flex tw-flex-col tw-justify-center'>
            <Image src={userImage} height={70} width={70} alt="Logo Pace'sport" 
                    className='tw-rounded-full shadow-sm tw-bg-white tw-p-2'/>
            </div>
            <Image className='tw-w-full tw-h-full tw-absolute tw-object-cover -tw-z-10 tw-blur-sm tw-scale-110' src={hero} placeholder='blur' alt="Hero image"/>
        </header>
    )
}