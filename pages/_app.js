import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@/styles/globals.css'
import '../styles/SearchInput.css'
import Navbar from '@/components/navbar/Navbar';
import HeroSection from '@/components/HeroSection';



export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
      getLayout(
        <>
          <Component {...pageProps} />
        </>
      )
  )
}
