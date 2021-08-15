import { ChakraProvider } from '@chakra-ui/react';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { theme } from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextAuthProvider session={pageProps.session}>
        <ChakraProvider resetCSS theme={theme}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </ChakraProvider>
      </NextAuthProvider>
    </>
  );
}

export default MyApp;
