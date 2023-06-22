import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@/styles/globals.css'
import '@/styles/SearchInput.css'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Context, { AppContext } from '../context/AppContext';
import { useContext, useState } from 'react';
import { Router } from 'next/router';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { ThemeProvider } from '@mui/material';
import lightTheme from '../styles/theme/lightTheme';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

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

App.getInitialProps = async ({Component, ctx}) => {
  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  // si page autre que connexion ou accueil, vérifier l'authentication
  if (!['/login', '/home'].includes(ctx.pathname)) {
    if (ctx.req) {
      const token = ctx.req.cookies['token']
      let response = await fetch(`${process.env.API_URL}/api/verify/jwt`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
      )
      response = await response.json();
      if (response.code == 401) {
          ctx.res.writeHead(302, { Location: '/login' })
          ctx.res.end()
          return
      }
    }
  }

  return {pageProps}
}