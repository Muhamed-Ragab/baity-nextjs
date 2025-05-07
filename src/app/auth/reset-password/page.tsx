import { AuthContainer } from "../components/AuthContainer";
import { ResetPasswordForm } from "./components/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <AuthContainer>
      <AuthContainer.Header>
        <AuthContainer.Title>Reset Password</AuthContainer.Title>
      </AuthContainer.Header>
      <ResetPasswordForm />
    </AuthContainer>
  );
};

export default ResetPassword;
