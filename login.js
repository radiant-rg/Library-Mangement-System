import { supabase } from './supabase/client.js';

const form = document.getElementById('login-form');
const nameGroup = document.getElementById('name-group');
const nameInput = document.getElementById('full-name');
const emailInput = document.getElementById('email');
const passwordGroup = document.getElementById('password-group');
const passwordInput = document.getElementById('password');
const errorEl = document.getElementById('login-error');
const submitButton = document.getElementById('submit-auth');
const togglePassword = document.getElementById('toggle-password');
const forgotPassword = document.getElementById('forgot-password');
const switchAuthMode = document.getElementById('switch-auth-mode');
const title = document.getElementById('login-title');
const description = document.getElementById('login-description');

let mode = 'login';

function showMessage(message, success = false) {
  errorEl.textContent = message;
  errorEl.classList.toggle('success', success);
}

function setMode(nextMode) {
  mode = nextMode;
  showMessage('');

  const isSignup = mode === 'signup';
  const isReset = mode === 'reset';
  const isNewPassword = mode === 'new-password';
  nameGroup.hidden = !isSignup;
  nameInput.required = isSignup;
  passwordGroup.hidden = isReset;
  passwordInput.required = !isReset;
  passwordInput.minLength = isSignup || isNewPassword ? 8 : 0;
  passwordInput.autocomplete = isNewPassword ? 'new-password' : 'current-password';
  togglePassword.hidden = isReset;
  forgotPassword.hidden = isReset || isNewPassword;
  switchAuthMode.hidden = isNewPassword;

  if (isSignup) {
    title.textContent = 'Create your account';
    description.textContent = 'Register for access to the library.';
    submitButton.textContent = 'Create Account';
    switchAuthMode.textContent = 'Back to sign in';
  } else if (isReset) {
    title.textContent = 'Reset your password';
    description.textContent = 'We will email you a secure password reset link.';
    submitButton.textContent = 'Send Reset Link';
    switchAuthMode.textContent = 'Back to sign in';
  } else if (isNewPassword) {
    title.textContent = 'Choose a new password';
    description.textContent = 'Use at least 8 characters for your new password.';
    submitButton.textContent = 'Update Password';
  } else {
    title.textContent = 'Welcome back';
    description.textContent = 'Sign in to manage your library.';
    submitButton.textContent = 'Sign In';
    switchAuthMode.textContent = 'Create account';
  }
}

togglePassword.addEventListener('click', () => {
  const showPassword = passwordInput.type === 'password';
  passwordInput.type = showPassword ? 'text' : 'password';
  togglePassword.textContent = showPassword ? 'Hide' : 'Show';
});

forgotPassword.addEventListener('click', () => setMode('reset'));
switchAuthMode.addEventListener('click', () => {
  setMode(mode === 'signup' || mode === 'reset' ? 'login' : 'signup');
});
setMode('login');

supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    setMode('new-password');
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('');
  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  try {
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: emailInput.value.trim(),
        password: passwordInput.value,
        options: {
          data: { full_name: nameInput.value.trim() },
          emailRedirectTo: `${window.location.origin}/index.html`
        }
      });
      if (error) throw error;
      if (data.session) {
        window.location.replace('index.html');
      } else {
        showMessage('Check your email to confirm your account, then sign in.', true);
      }
    } else if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(
        emailInput.value.trim(),
        { redirectTo: `${window.location.origin}/login.html` }
      );
      if (error) throw error;
      showMessage('If an account exists for that email, a reset link has been sent.', true);
    } else if (mode === 'new-password') {
      const { error } = await supabase.auth.updateUser({ password: passwordInput.value });
      if (error) throw error;
      setMode('login');
      showMessage('Password updated. Sign in with your new password.', true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput.value.trim(),
        password: passwordInput.value
      });
      if (error) throw error;
      window.location.replace('index.html');
    }
  } catch (error) {
    showMessage(error.message || 'Authentication failed. Please try again.');
  } finally {
    submitButton.disabled = false;
  }
});

const { data, error } = await supabase.auth.getSession();
if (error) {
  showMessage(error.message);
} else if (data.session && !window.location.hash.includes('type=recovery')) {
  window.location.replace('index.html');
}
