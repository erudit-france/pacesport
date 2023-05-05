import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@/styles/globals.css'
import '@/styles/SearchInput.css'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { AppContext } from '../context/AppContext';
import { useState } from 'react';
import { Router } from 'next/router';



export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('particulier');

  return (
        <AppContext.Provider value={{user, setUser, role, setRole}}>
          <MantineProvider withGlobalStyles withNormalizeCSS>
            <NotificationsProvider>
              {getLayout(<Component {...pageProps} />)}
            </NotificationsProvider>
          </MantineProvider>
        </AppContext.Provider>
  )
}

App.getInitialProps = async ({res, Component, ctx}) => {
  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  
  console.log('ctx.pathname', ctx.pathname)
  // si page autre que connexion ou accueil, vérifier l'authentication
  if (!['/login', '/home'].includes(ctx.pathname)) {
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

  return {pageProps}
}