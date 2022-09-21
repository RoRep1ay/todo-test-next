import '../styles/globals.css'
import { initializeApp } from 'firebase/app';
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
