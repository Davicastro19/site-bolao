import '../../styles/globals.scss'
import { AppProps } from 'next/app';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@fontsource/roboto"
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/100.css'
import { AuthProvider } from '../contexts/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';

import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: '#141414',
        color: 'white',
        
      },
      // styles for the `a`
      fonts: {
        heading: `'Roboto', sans-serif`,
        body: `'Roboto', sans-serif`,
        
      },
    },
  },
})
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider >
      <ChakraProvider theme={theme} >
    <Component {...pageProps} />
    <ToastContainer autoClose={3000} />
    </ChakraProvider>
    </AuthProvider>)
}

export default MyApp
