import { SegmentedControls } from "@/components/login/SegmentedControls";
import Head from "next/head";
import SignupForm from "./components/SignupForm";
import { AspectRatio, BackgroundImage, Overlay, Tabs, Text } from '@mantine/core';
import LoginForm from "./components/LoginForm";
import { useState } from "react";
import logo from '../../public/logo.png'
import Image from "next/image";
import Layout from "@/components/layout/GradientDoodle"

export default function Page() {
    const [activeTab, setActiveTab] = useState('Connexion');
    const [visible, setVisible] = useState(false);
    const overlayHandler = (isVisible) => setVisible(isVisible)

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT | Connexion</title>
                <meta property="og:title" content="PACE&lsquo;SPORT | Connexion" key="title" />
            </Head>
            <div>
                {visible && 
                    <>
                        <Overlay color="#000" opacity={1}>
                        <BackgroundImage className="tw-h-full tw-opacity-30" 
                                src={'/doodle-pattern.png'}/>
                            
                            <div className="tw-absolute tw-z-[201]"
                                style={ {top: 'calc(50vh - 80px)', left: 'calc(50vw - 50px)'} }>
                                <Image src={logo} height={100} width={100} alt="Logo Pace'sport" 
                                    className='tw-rounded-full shadow-sm tw-bg-white/80 tw-p-2 tw-mx-auto'/>

                                <Text fz={'xs'} transform="uppercase" align="center" color="white" mt={'lg'}>Chargement...</Text>
                            </div>
                        </Overlay>
                    </>}
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
        </>
    )
}


Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }
