import { ActionIcon, Avatar, BackgroundImage, Box, FileButton, Flex, Group } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import fileUploader from "@/utils/fileUploader"
import { useDisclosure } from "@mantine/hooks";
import { RxCheck, RxCross2 } from 'react-icons/rx';
import { getCookie } from 'cookies-next';
import Navbar from '@/components/navbar/Navbar';
import Toast from '@/services/Toast';
import hero from '@/public/hand-in-hand.jpg'
import Image from "next/image";
import HeroSection from "@/components/sponsor/HeroSection";

export default function Layout({children}){
    return (
        <>
          <Navbar />
          <HeroSection avatar={children ? children.props.avatar : null} />
          <main>
            {children}
          </main>
        </>
    )
}