export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
}

export interface ForgetPasswordFormData {
  email: string;
}

export interface OTPFormData {
  otp: string;
}

export interface ResetPasswordFormData {
  // email: string;
  newPassword: string;
  confirmPassword: string;
}
