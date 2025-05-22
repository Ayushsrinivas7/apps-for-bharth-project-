import { getOrderHistory } from './api.js';
import { trackEvent } from './mixpanel.js';

let currentPage = 1;
const pageSize = 5;

export async function showOrderHistory() {
  const orderHistorySection = document.getElementById('order-history-section');
  const orderHistoryList = document.getElementById('order-history-list');
  const pageInfo = document.getElementById('order-history-page-info');
  const prevBtn = document.getElementById('order-history-prev');
  const nextBtn = document.getElementById('order-history-next');
  const userId = localStorage.getItem('userId');

  orderHistorySection.classList.remove('hidden');
  document.getElementById('products-section').classList.add('hidden');
  document.getElementById('cart-section').classList.add('hidden');
  trackEvent('View Order History', { page: currentPage });

  async function loadOrderHistory(page) {
    const result = await getOrderHistory(userId, page, pageSize);
    if (result.success) {
      orderHistoryList.innerHTML = result.products.length ? result.products.map(product => `
        <div class="card">
          <h3>${product.name}</h3>
          <p>Quantity Remaining: ${product.quantity}</p>
        </div>
      `).join('') : '<p>No orders yet</p>';
      pageInfo.textContent = `Page ${result.pagination.currentPage} of ${result.pagination.totalPages}`;
      prevBtn.disabled = result.pagination.currentPage === 1;
      nextBtn.disabled = result.pagination.currentPage === result.pagination.totalPages;
      trackEvent('Order History Loaded', { page: result.pagination.currentPage, totalOrders: result.products.length });
    }
  }

  await loadOrderHistory(currentPage);

  prevBtn.addEventListener('click', async () => {
    if (currentPage > 1) {
      currentPage--;
      trackEvent('Order History Page Previous', { page: currentPage });
      await loadOrderHistory(currentPage);
    }
  });

  nextBtn.addEventListener('click', async () => {
    currentPage++;
    trackEvent('Order History Page Next', { page: currentPage });
    await loadOrderHistory(currentPage);
  });
}