import { getCart, payForProduct } from './api.js';
import { showCart } from './cart.js';
import { trackEvent } from './mixpanel.js';

export function initPayment() {
  const payBtn = document.getElementById('cart-pay');
  const userId = localStorage.getItem('userId');

  payBtn.addEventListener('click', async () => {
    const cartResult = await getCart(userId);
    if (cartResult.success && cartResult.cart.length) {
      for (const item of cartResult.cart) {
        trackEvent('Payment Attempt', { productId: item.productId });
        const result = await payForProduct(item.productId, userId);
        if (result.success) {
          trackEvent('Payment Success', { productId: item.productId });
        } else {
          trackEvent('Payment Failed', { productId: item.productId, error: result.message });
        }
        alert(result.message);
      }
      showCart();
    }
  });
} 