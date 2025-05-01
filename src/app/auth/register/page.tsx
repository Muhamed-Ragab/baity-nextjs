import { AuthContainer } from '../components/AuthContainer';
import { RegisterForm } from './components/RegisterForm';

const Register = () => {
  return (
    <AuthContainer>
      <AuthContainer.Header>
        <AuthContainer.Title>Register to Your Account</AuthContainer.Title>
      </AuthContainer.Header>
      <AuthContainer.Content>
        <RegisterForm />
      </AuthContainer.Content>
      <AuthContainer.Footer>
        <AuthContainer.Link href='/auth/login' description='Already have an account?'>
          Login
        </AuthContainer.Link>
      </AuthContainer.Footer>
    </AuthContainer>
  );
};

export default Register;
