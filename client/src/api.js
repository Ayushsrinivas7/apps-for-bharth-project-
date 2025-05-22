  const API_BASE_URL = 'http://localhost:3000/api';

  async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return await response.json();
  }

  export const login = (email, password) =>
    apiRequest('/user/login', 'POST', { email, password });

  export const signup = (email, password) =>
    apiRequest('/user/signup', 'POST', { email, password });

  export const getProducts = (page = 1, pageSize = 5) =>
    apiRequest(`/product/paginated?page=${page}&pageSize=${pageSize}`);

  export const addToCart = (productId, userId, quantity) =>
    apiRequest(`/product/addtoCart/${productId}`, 'POST', { userId, quantity });

  export const getCart = (userId) =>
    apiRequest(`/product/getCartProducts?userId=${userId}`);

  export const removeFromCart = (productId, userId) =>
    apiRequest(`/product/deleterfromCart/${productId}`, 'DELETE', { userId });

  export const payForProduct = (productId, userId) =>
    apiRequest(`/product/payment/${productId}`, 'POST', { userId, paid: true });

  export const getOrderHistory = (userId, page = 1, pageSize = 5) =>
    apiRequest(`/product/history?userId=${userId}&page=${page}&pageSize=${pageSize}`);