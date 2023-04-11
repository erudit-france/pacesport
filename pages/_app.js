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
