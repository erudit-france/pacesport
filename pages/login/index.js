import { SegmentedControls } from "@/components/login/SegmentedControls";
import Head from "next/head";
import SignupForm from "./components/SignupForm";
import { Tabs } from '@mantine/core';
import LoginForm from "./components/LoginForm";
import { useState } from "react";

export default function Login() {
    const [activeTab, setActiveTab] = useState('Connexion');

    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT | Connexion</title>
                <meta property="og:title" content="PACE&lsquo;SPORT | Connexion" key="title" />
            </Head>
            <button onClick={() => setTab(!tab)}></button>
            <main className="container">
                <div className="tw-flex tw-justify-center">
                    <SegmentedControls tabHandler={setActiveTab} />
                </div>
                <Tabs value={activeTab}>
                    <Tabs.Panel value="Inscription">
                        <SignupForm />
                    </Tabs.Panel>
                    <Tabs.Panel value="Connexion">
                        <LoginForm />
                    </Tabs.Panel>
                </Tabs>
            </main>
        </>
    )
}
