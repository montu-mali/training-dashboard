const validatePassword = (password: string): string | null => {
  const minLength = 8;
  const uppercasePattern = /[A-Z]/;
  const lowercasePattern = /[a-z]/;
  const digitPattern = /[0-9]/;
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long.`;
  }
  if (!uppercasePattern.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!lowercasePattern.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  if (!digitPattern.test(password)) {
    return "Password must include at least one digit.";
  }
  if (!specialCharPattern.test(password)) {
    return "Password must include at least one special character.";
  }

  return null; // Password is strong
};

export default validatePassword;
