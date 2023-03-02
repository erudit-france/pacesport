import { Html, Head, Main, NextScript } from 'next/document'
import { MantineProvider } from '@mantine/core';

export default function Document() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Html lang="fr">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </MantineProvider>
  )
}
