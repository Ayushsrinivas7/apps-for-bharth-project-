import './style.css';
import { initAuth } from './auth.js';
import { showProducts } from './products.js';
import { showCart } from './cart.js';
import { initPayment } from './payment.js';
import { showOrderHistory } from './orderHistory.js';
import { trackEvent, initMixpanel } from './mixpanel.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initMixpanel(); // Wait for Mixpanel initialization
  } catch (error) {
    console.error('Mixpanel initialization failed, continuing without analytics:', error);
  }
  initAuth();
  initPayment();

  document.getElementById('products-btn').addEventListener('click', () => {
    trackEvent('Navigate to Products');
    showProducts();
  });
  document.getElementById('cart-btn').addEventListener('click', () => {
    trackEvent('Navigate to Cart');
    showCart();
  });
  document.getElementById('order-history-btn').addEventListener('click', () => {
    trackEvent('Navigate to Order History');
    showOrderHistory();
  });
  document.getElementById('logout-btn').addEventListener('click', () => {
    trackEvent('Logout', { userId: localStorage.getItem('userId') });
    localStorage.removeItem('userId');
    document.getElementById('navbar').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('signup-section').classList.add('hidden');
    document.getElementById('products-section').classList.add('hidden');
    document.getElementById('cart-section').classList.add('hidden');
    document.getElementById('order-history-section').classList.add('hidden');
  });
});