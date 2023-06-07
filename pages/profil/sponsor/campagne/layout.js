import Navbar from "@/components/navbar/Navbar";
import {Image} from "@mantine/core";


const CampagneHeader = ({filename}) => {
    return (
        <header className='tw-flex tw-justify-center tw-h-52 tw-bg-gradient-to-br tw-from-gray-800 tw-to-black/90
                tw-relative'>
            <div className='tw-flex tw-flex-col tw-justify-center -tw-top-3'>
            <Image className="tw-shadow-md" radius={'lg'} width={220} height={120} src={`/uploads/${filename}`} alt="With default placeholder" withPlaceholder/>
            </div>
        </header>
    )
}

export default function Layout({children}){
    console.log('children', children.props.card)
    return (
        <>
            <Navbar />
            <CampagneHeader filename={children.props?.card?.image?.name} />
            <main className="tw-bg-gradient-to-b tw-from-gray-100 tw-to-white tw-rounded-t-[2rem] tw-relative -tw-mt-7 tw-pt-7"
                style={{ minHeight: 'calc(100vh - 180px)' }}>{children}</main>
        </>
    )
}