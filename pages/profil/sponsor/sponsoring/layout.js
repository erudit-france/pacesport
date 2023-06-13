import Navbar from "@/components/navbar/Navbar";
import { BackgroundImage } from "@mantine/core";

export default function Layout({children}){
    const background = children.props?.sponsoringOffer?.images.length > 0
        ? '/uploads/' + children.props.sponsoringOffer.images[0].filename
        : null
    return (
        <>
            <Navbar />
            <div>
                <header className='tw-flex tw-justify-center tw-h-52 tw-bg-gradient-to-br tw-from-gray-800 tw-to-black/90
                        tw-relative'>
                    <BackgroundImage className="tw-shadow-md" src={background} alt="With default placeholder" withPlaceholder/>
                </header>
                {children}
            </div>
        </>
    )
}