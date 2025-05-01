import { AuthContainer } from '../components/AuthContainer';
import { BackButton } from './components/BackButton';
import { EmailVerificationForm } from './components/EmailVerificationForm';

const EmailVerification = () => {
  return (
    <AuthContainer>
      <AuthContainer.Header>
        <BackButton />
        <AuthContainer.Title>Email Verification</AuthContainer.Title>
      </AuthContainer.Header>
      <EmailVerificationForm />
    </AuthContainer>
  );
};

export default EmailVerification;
