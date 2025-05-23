import { login, signup } from './api.js';
import { showProducts } from './products.js';
import { trackEvent, identifyUser, setUserProfile } from './mixpanel.js';

export function initAuth() {
  const loginSection = document.getElementById('login-section');
  const signupSection = document.getElementById('signup-section');
  const navbar = document.getElementById('navbar');
  const loginSubmit = document.getElementById('login-submit');
  const signupSubmit = document.getElementById('signup-submit');
  const showSignup = document.getElementById('show-signup');
  const showLogin = document.getElementById('show-login');
  const loginError = document.getElementById('login-error');
  const signupError = document.getElementById('signup-error');

  if (localStorage.getItem('userId')) {
    loginSection.classList.add('hidden');
    signupSection.classList.add('hidden');
    navbar.classList.remove('hidden');
    showProducts();
  }

  loginSubmit.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    trackEvent('Login Attempt', { email });
    const result = await login(email, password);
    if (result.success) {
      const userId = result.user.id;
      localStorage.setItem('userId', userId);
      identifyUser(userId);
      setUserProfile(userId, { email });
      trackEvent('Login Success', { email });
      loginSection.classList.add('hidden');
      signupSection.classList.add('hidden');
      navbar.classList.remove('hidden');
      showProducts();
    } else {
      trackEvent('Login Failed', { email, error: result.message });
      loginError.textContent = result.message;
      loginError.classList.remove('hidden');
    }
  });

  signupSubmit.addEventListener('click', async () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    trackEvent('Signup Attempt', { email });
    const result = await signup(email, password);
    if (result.success) {
      const userId = result.user.id;
      localStorage.setItem('userId', userId);
      identifyUser(userId);
      setUserProfile(userId, { email });
      trackEvent('Signup Success', { email });
      signupSection.classList.add('hidden');
      loginSection.classList.add('hidden');
      navbar.classList.remove('hidden');
      showProducts();
    } else {
      trackEvent('Signup Failed', { email, error: result.message });
      signupError.textContent = result.message;
      signupError.classList.remove('hidden');
    }
  });

  showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    trackEvent('View Signup Page');
    loginSection.classList.add('hidden');
    signupSection.classList.remove('hidden');
  });

  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    trackEvent('View Login Page');
    signupSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  });
}