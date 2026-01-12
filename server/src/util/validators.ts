// server/src/util/validators.ts

// Helper function to define the structure of validation errors
interface ValidationResult {
  errors: Record<string, string>;
  valid: boolean;
}

export const validateRegisterInput = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  // 1. Username checks
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }

  // 2. Email checks
  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    // Standard Regex for Email Validation
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }

  // 3. Password checks
  if (password === '') {
    errors.password = 'Password must not empty';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

export const validateLoginInput = (username: string, password: string): ValidationResult => {
  const errors: Record<string, string> = {};

  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};