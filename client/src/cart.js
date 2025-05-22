import { getCart, removeFromCart } from './api.js';
import { trackEvent } from './mixpanel.js';

export async function showCart() {
  const cartSection = document.getElementById('cart-section');
  const cartList = document.getElementById('cart-list');
  const payBtn = document.getElementById('cart-pay');
  const userId = localStorage.getItem('userId');

  cartSection.classList.remove('hidden');
  document.getElementById('products-section').classList.add('hidden');
  document.getElementById('order-history-section').classList.add('hidden');
  trackEvent('View Cart');

  const result = await getCart(userId);
  if (result.success) {
    cartList.innerHTML = result.cart.length ? result.cart.map(item => `
      <div class="card">
        <div>
          <h3>${item.product?.name || 'Unknown'}</h3>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <button class="remove-from-cart btn" data-id="${item.productId}">Remove</button>
      </div>
    `).join('') : '<p>No items in cart</p>';
    payBtn.classList.toggle('hidden', !result.cart.length);

    trackEvent('Cart Loaded', { itemCount: result.cart.length });

    document.querySelectorAll('.remove-from-cart').forEach(btn => {
      btn.addEventListener('click', async () => {
        const productId = btn.dataset.id;
        const result = await removeFromCart(productId, userId);
        trackEvent('Remove from Cart', { productId });
        alert(result.message);
        showCart();
      });
    });
  }
}