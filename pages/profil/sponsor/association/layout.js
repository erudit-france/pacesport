import { BackgroundImage } from "@mantine/core";
import Navbar from '@/components/navbar/Navbar';
import React, { useState } from 'react';
import HeroSection from '@/components/particulier/HeroSection';
    
export default function Layout({children}){
    return (
        <>
            <Navbar />
            <main className="tw-min-h-screen">
                <div className="">
                    <HeroSection  editable={false} avatar={children ? children.props.avatar : null} />
                    <section className="tw-z-20">{children}</section>
                </div>
                <div className="tw-w-full tw-h-full tw-absolute tw-top-0 -tw-z-10">
                    <BackgroundImage className="tw-h-full tw-opacity-10" 
                        src={'/doodle-pattern.png'}/>
                    <BackgroundImage className="tw-h-full tw-w-full tw-absolute tw-top-0 tw-opacity-80 -tw-z-20
                        tw-bg-gradient-to-b tw-from-white tw-from-30% tw-via-gold-300 tw-via-60% tw-to-gold-600 tw-to-90%" />
                </div>
            </main>
        </>
    )
}