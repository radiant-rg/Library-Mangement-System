const AUTH_KEY = 'libracore_auth';
const USER_KEY = 'libracore_logged_user';
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';

// If already logged in, skip the login screen.
if (localStorage.getItem(AUTH_KEY) === 'true') {
  window.location.replace('index.html');
}

const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorEl = document.getElementById('login-error');
const togglePassword = document.getElementById('toggle-password');
const rememberMe = document.getElementById('remember-me');

togglePassword.addEventListener('click', () => {
  const hidden = passwordInput.type === 'password';
  passwordInput.type = hidden ? 'text' : 'password';
  togglePassword.textContent = hidden ? 'Hide' : 'Show';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  errorEl.textContent = '';

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    errorEl.textContent = 'Please enter your username and password.';
    return;
  }

  if (username.toLowerCase() !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
    errorEl.textContent = 'Invalid username or password.';
    return;
  }

  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(USER_KEY, JSON.stringify({
    username: DEMO_USERNAME,
    name: 'Ranik Ghosh',
    role: 'Head Librarian (Admin)',
    remembered: rememberMe.checked
  }));

  window.location.replace('index.html');
});
