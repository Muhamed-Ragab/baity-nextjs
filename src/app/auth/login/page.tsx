import { AuthContainer } from '../components/AuthContainer';
import { LoginForm } from './components/LoginForm';
import { OAuth } from './components/OAuth';

const Login = () => {
  return (
    <AuthContainer>
      <AuthContainer.Header>
        <AuthContainer.Title>Login to Your Account</AuthContainer.Title>
      </AuthContainer.Header>
      <AuthContainer.Content>
        <OAuth />
        <div className='mb-2 flex items-center justify-between gap-2 md:mb-3'>
          <div className='h-[1px] flex-1 bg-gray-200' />
          <p className='text-gray-400'>OR</p>
          <div className='h-[1px] flex-1 bg-gray-200' />
        </div>
        <LoginForm />
      </AuthContainer.Content>
      <AuthContainer.Footer>
        <AuthContainer.Link href='/auth/register' description="Don't have an account?">
          Register
        </AuthContainer.Link>
      </AuthContainer.Footer>
    </AuthContainer>
  );
};

export default Login;
