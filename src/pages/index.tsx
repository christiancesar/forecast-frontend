import {
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Link as ChakraLink,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { signin, useSession } from 'next-auth/client';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import * as yup from 'yup';
import { Input } from '../components/Form/Input';
import { AuthContext } from '../contexts/AuthContext';
import { withSSRGuest } from '../utils/withSSRGuest';

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatório'),
});

export default function Home() {
  const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const { errors } = formState;

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    try {
      setLoading(true);
      await signIn(values);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Flex
      w="100%"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <Stack spacing="8">
        <Image
          src="/logo.svg"
          w="180px"
          alt="Forecast logo"
          alignSelf="center"
          marginBottom="5"
        />

        {/* <Button
            leftIcon={<FaGoogle />}
            type="submit"
            mt="6"
            colorScheme="red"
            size="lg"
            fontWeight="400"
            onClick={() => signin('google')}
          >
            Entre com o Google
          </Button>

          <Flex align="center">
            <Divider color="gray.300" />
            <Text marginLeft="2" marginRight="2" color="gray.300">
              Ou
            </Text>
            <Divider color="gray.300" />
          </Flex> */}

        <Flex
          as="form"
          width="100%"
          margin="auto"
          flexDir="column"
          padding="6"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing="5">
            <Input
              label="Email"
              size="lg"
              name="email"
              type="email"
              error={errors.email}
              {...register('email', {})}
            />
            <Input
              label="Senha"
              size="lg"
              name="password"
              type="password"
              error={errors.password}
              {...register('password')}
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
            Login
          </Button>
        </Flex>

        <Link href="/signup" passHref>
          <ChakraLink _hover={{ color: '#44EE88' }} alignSelf="center">
            <Icon as={FiLogOut} marginRight="2" />
            Registrar-se
          </ChakraLink>
        </Link>
      </Stack>
    </Flex>
  );
}

export const getServerSideProps = withSSRGuest(async ctx => {
  return {
    props: {},
  };
});
