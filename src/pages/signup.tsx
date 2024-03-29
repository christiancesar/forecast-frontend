import {
  Button,
  Flex,
  Icon,
  Image,
  Link as ChakraLink,
  ScaleFade,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronLeft } from 'react-icons/fa';
import * as yup from 'yup';
import { Input } from '../components/Form/Input';
import { api } from '../services/apiClient';
import { withSSRGuest } from '../utils/withSSRGuest';

type SignInFormData = {
  email: string;
  password: string;
};

// validate phone number
const pattern = /^\s*(\d{2})[-. ]?(\d{1})[ ]?(\d{4})[-. ]?(\d{4})*$/;

const signInFormSchema = yup.object().shape({
  firstName: yup.string().required('Nome obrigatório'),
  lastName: yup.string().required('Sobrenome obrigatório'),
  phone: yup
    .string()
    .required('Telefone obrigatório')
    .matches(pattern, 'Numero de telefone não é valido'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup
    .string()
    .required('Senha obrigatório')
    .min(6, 'Senha deve ser maior que 6 dígitos'),
  confirmation_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Confirmação não é igual a senha'),
});

export default function Home() {
  const [scaleFade, setScaleFade] = useState(true);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const { errors } = formState;

  const toast = useToast();

  async function handleClickRegister() {
    setScaleFade(false);
    await new Promise(resolve => setTimeout(resolve, 300));
    push('/');
  }

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    try {
      setLoading(!loading);
      await api.post('/users', values);
      toast({
        description: 'Sua conta foi criada, aproveite 😁',
        status: 'success',
        position: 'top-right',
        isClosable: false,
      });
      setLoading(!loading);
    } catch (error) {
      setLoading(!loading);
      toast({
        title: 'Erro',
        description: 'Email já cadastrado em nossa base de dados 🙁',
        status: 'error',
        position: 'top-right',
        isClosable: false,
      });
    }
  };

  return (
    <>
      <ScaleFade
        transition={{ enter: { duration: 0.2, delay: 0.5 } }}
        in={scaleFade}
        unmountOnExit
      >
        <Flex as="header" padding="5" marginBottom="8">
          {/* <Link href="/" passHref> */}
          <Button
            bg="transparent"
            _hover={{ color: '#44EE88' }}
            onClick={handleClickRegister}
          >
            <Icon as={FaChevronLeft} />
          </Button>
          {/* </Link> */}
          <Image
            src="/logotipo.svg"
            w="150px"
            alt="Forecast logo"
            margin="0 auto"
          />
        </Flex>
        <Flex
          as="form"
          w="100vw"
          h="80vh"
          margin="auto"
          maxW="500px"
          flexDir="column"
          justifyContent="center"
          padding="6"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing="4">
            <Stack direction="row">
              <Input
                label="Nome"
                size="lg"
                name="firstName"
                type="firstName"
                placeholder="John"
                error={errors.firstName}
                {...register('firstName')}
              />
              <Input
                label="Sobrenome"
                size="lg"
                name="lastName"
                type="lastName"
                placeholder="Doe"
                error={errors.lastName}
                {...register('lastName')}
              />
            </Stack>
            <Input
              label="Celular"
              size="lg"
              name="phone"
              placeholder="66 9 XXXX XXXX"
              type="tel"
              error={errors.phone}
              {...register('phone')}
            />
            <Input
              label="Email"
              size="lg"
              name="email"
              type="email"
              placeholder="exemplo@gmail.com"
              error={errors.email}
              {...register('email')}
            />
            <Input
              label="Senha"
              size="lg"
              name="password"
              type="password"
              placeholder="Mínimo de 8 caracteres"
              error={errors.password}
              {...register('password')}
            />
            <Input
              label="Confirmar senha"
              size="lg"
              name="confirmation_password"
              type="password"
              error={errors.confirmation_password}
              {...register('confirmation_password')}
            />
          </Stack>
          <Button
            type="submit"
            mt="6"
            bg="#282A36"
            size="lg"
            isLoading={loading}
            _hover={{ backgroundColor: '#44EE88', color: '#282A36' }}
          >
            Registrar
          </Button>
        </Flex>
      </ScaleFade>
    </>
  );
}

// export const getServerSideProps = withSSRGuest(async ctx => {
//   return {
//     props: {},
//   };
// });
