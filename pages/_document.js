import { Html, Head, Main, NextScript } from 'next/document'
import { MantineProvider } from '@mantine/core';

export default function Document() {
  return (
      <Html lang="fr">
        <Head>
          {/* <!-- Chrome, Firefox OS and Opera --> */}
          <meta name="theme-color" content="#b82318"/>
          {/* <!-- Windows Phone --> */}
          <meta name="msapplication-navbutton-color" content="#b82318"/>
          {/* <!-- iOS Safari --> */}
          <meta name="apple-mobile-web-app-status-bar-style" content="#b82318"/>

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
  )
}
