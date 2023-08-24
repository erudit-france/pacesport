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
          {/* Préchargement et secours de CSS */}
          <link rel="preload" href="/styles/globals.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
          <link rel="preload" href="/styles/Home.module.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
          <link rel="preload" href="/styles/Menu.module.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
          <link rel="preload" href="/styles/SearchInput.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
          {/* <noscript><link rel="stylesheet" href="votre-fichier.css" /></noscript> */}
        </Head>
        <body className="fixed top-0 left-0 w-full h-full overflow-y-scroll overflow-x-hidden touch-scroll">
          <Main />
          <NextScript />
        </body>
      </Html>
  )
}
