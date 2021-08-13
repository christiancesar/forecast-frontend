import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { withSSRGuest } from '../utils/withSSRGuest';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password,
    };
    await signIn(data);
  }
  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '500px',
          margin: 'auto',
        }}
      >
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            marginTop: '0.5rem',
          }}
        />
        <button
          type="submit"
          style={{
            marginTop: '1rem',
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps = withSSRGuest(async ctx => {
  return {
    props: {},
  };
});
