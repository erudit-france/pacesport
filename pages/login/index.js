import { SegmentedControls } from "@/components/login/SegmentedControls";
import Head from "next/head";
import SignupForm from "./components/SignupForm";
import { AspectRatio, BackgroundImage, Overlay, Tabs, Text } from '@mantine/core';
import LoginForm from "./components/LoginForm";
import { useState, useEffect } from "react";
import logo from '../../public/logo.png'
import Image from "next/image";
import { useRouter } from 'next/router';  // Correction ici
import Layout from "@/components/layout/GradientDoodle";

export default function Page() {
    const [activeTab, setActiveTab] = useState("Connexion");
    const [visible, setVisible] = useState(false);
    const [isCssLoaded, setIsCssLoaded] = useState(false);  // Ajoutez cette ligne
    const router = useRouter();

    useEffect(() => {
        // Vérifie si localStorage est disponible
        const storageAvailable = typeof window.localStorage !== "undefined";

        if (storageAvailable) {
            const token = localStorage.getItem('token');
            if (token) {
                const EXPIRATION_TIME = 60 * 60 * 24;
                document.cookie = `token=${token};max-age=${EXPIRATION_TIME}`;
                setVisible(true);
                setIsCssLoaded(false);
                router.push('/login/as').then(() => {
                    const timer = setTimeout(() => {
                        setVisible(false);
                        setIsCssLoaded(true);
                    }, 2000);
                }).catch((err) => {
                    setVisible(false);
                    setIsCssLoaded(true);
                });
            } else {
                setVisible(true);
                const timer = setTimeout(() => {
                    setVisible(false);
                }, 2000);
                return () => clearTimeout(timer);
            }
        }

    }, []);

    const overlayHandler = (isVisible) => setVisible(isVisible);
    const overlayClass = visible ? 'fade-enter-active' : 'fade-exit-active';
    const mainContentClass = visible ? 'hidden' : 'visible';
    const timer = setTimeout(() => {
        setIsCssLoaded(true);
    }, 1000);
    return (
        <>
            <Head>
                <title>PACE'SPORT | Connexion</title>
                <meta property="og:title" content="PACE'SPORT | Connexion" key="title" />
            </Head>
            <div>
                {visible &&
                    <div className="tw-absolute tw-z-[201]"
                        style={{ top: 'calc(50vh - 80px)', left: 'calc(50vw - 50px)' }}>
                        <Image src={logo} height={100} width={100} alt="Logo Pace'sport"
                            className='tw-rounded-full shadow-sm tw-bg-red/80 tw-p-2 tw-mx-auto' />

                        <Text fz={'xs'} transform="uppercase" align="center" color="white" mt={'lg'}>Chargement...</Text>
                    </div>
                }
                {isCssLoaded && (
                    <div className={`${overlayClass} ${mainContentClass}`}>
                        <button onClick={() => setTab(!tab)}></button>
                        <main className="container tw-p-2">
                            <div className="tw-w-full tw-mb-1 tw-relative tw-top-1">
                                <SegmentedControls tabHandler={setActiveTab} />
                            </div>
                            <Tabs value={activeTab}>
                                <Tabs.Panel value="Inscription">
                                    <SignupForm loading={overlayHandler} />
                                </Tabs.Panel>
                                <Tabs.Panel value="Connexion">
                                    <LoginForm loading={overlayHandler} />
                                </Tabs.Panel>
                            </Tabs>
                        </main>
                    </div>
                )}
            </div>
        </>
    )

}


Page.getLayout = function getLayout(page) {
    return (
        <Layout>{page}</Layout>
    )
}
