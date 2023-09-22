import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@/styles/globals.css'
import '@/styles/SearchInput.css'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Context, { AppContext } from '../context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { Router } from 'next/router';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { ThemeProvider } from '@mui/material';
import lightTheme from '../styles/theme/lightTheme';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(function(OneSignal) {
      OneSignal.init({
        appId: "123a9223-94ef-4754-aced-7567857fa73f",
        safari_web_id: "web.onesignal.auto.5dcf04a7-d9b5-4793-8717-b5ec1870e3bb",
        notifyButton: {
          enable: true,
        },
      });
    });
  }, []); 

  return (
    <>
      <Context>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <ThemeProvider theme={lightTheme}>
              <NotificationsProvider>
                {getLayout(<Component {...pageProps} />)}
              </NotificationsProvider>
          </ThemeProvider>
        </MantineProvider>
      </Context>
    </>
  )
}

const exclude = [
  '/conditions-generales-vente',
  '/conditions-generales-utilisation',
  '/politique-de-confidentialite',
  '/home',
  '/login'
]

App.getInitialProps = async ({Component, ctx}) => {
  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  // si page autre que connexion ou accueil, vérifier l'authentication
  // if (!exclude.includes(ctx.pathname)) {
  //   if (ctx.req) {
  //     const token = ctx.req.cookies['token']
  //     let response = await fetch(`${process.env.API_URL}/api/verify/jwt`, {
  //       headers: new Headers({
  //               'JWTAuthorization': `Bearer ${token}`,
  //       })}
  //     )
  //     response = await response.json();
  //     if (response.code == 401) {
  //         ctx.res.writeHead(302, { Location: '/login' })
  //         ctx.res.end()
  //         return
  //     }
  //   }
  // }

  return {pageProps}
}