export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validatePasswordsMatch = (
  password: string,
  passwordConfirm: string
): boolean => {
  return password === passwordConfirm;
};
