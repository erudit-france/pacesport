import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@/styles/globals.css'
import '@/styles/SearchInput.css'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';



export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
      getLayout(
        <>
          <MantineProvider withGlobalStyles withNormalizeCSS>
            <NotificationsProvider>
              <Component {...pageProps} />
            </NotificationsProvider>
          </MantineProvider>
        </>
      )
  )
}
