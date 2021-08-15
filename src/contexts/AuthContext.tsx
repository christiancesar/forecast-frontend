import Router, { useRouter } from 'next/router';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { api } from '../services/apiClient';
import { useToast } from '@chakra-ui/react';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  fullName: string;
  email: string;
  individualTaxNumber: string;
  avatar: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, 'forecast.token');
  destroyCookie(undefined, 'forecast.refreshToken');

  authChannel.postMessage('signOut');

  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;
  const toast = useToast();
  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = message => {
      switch (message.data) {
        case 'signOut':
          signOut();
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { 'forecast.token': token } = parseCookies();

    if (token) {
      api
        .get('/users/me')
        .then(response => {
          const user = response.data;

          setUser(user);
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/users/sessions', {
        email,
        password,
      });

      const { token, refreshToken } = response.data;

      setCookie(undefined, 'forecast.token', token, {
        maxAge: 60 * 60 * 1, // 1h
        path: '/',
      });

      setCookie(undefined, 'forecast.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 1, // 1h
        path: '/',
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      await api
        .get('/users/me')
        .then(response => {
          const user = response.data;

          setUser(user);
        })
        .catch(() => {
          signOut();
        });
      Router.push('/dashboard');
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Credenciais incorretas 🙁',
        status: 'error',
        position: 'top-right',
        isClosable: false,
      });
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
