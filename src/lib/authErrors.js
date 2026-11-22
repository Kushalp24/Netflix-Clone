const MESSAGES = {
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/missing-password': 'Enter your password.',
  'auth/user-not-found': 'No account matches that email and password.',
  'auth/wrong-password': 'No account matches that email and password.',
  'auth/invalid-credential': 'No account matches that email and password.',
  'auth/invalid-login-credentials': 'No account matches that email and password.',
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
  'auth/weak-password': 'Choose a password with at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
  'auth/network-request-failed': 'Could not connect. Check your internet connection and try again.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/operation-not-allowed': 'Email and password sign-in is not enabled for this Firebase project.',
  'app/not-configured': 'Firebase is not configured. Add your Firebase keys to the .env file and restart the dev server.',
};

export function getAuthErrorMessage(error) {
  return MESSAGES[error?.code] || 'Something went wrong. Please try again.';
}
