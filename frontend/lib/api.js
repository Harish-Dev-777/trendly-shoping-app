export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAPI = async (endpoint, options = {}) => {
  const { getToken, ...customOptions } = options;
  
  const headers = {
    'Content-Type': 'application/json',
    ...customOptions.headers,
  };

  if (getToken) {
    try {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Error fetching token:", e);
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...customOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

// Example usage hooks/services could be built on top of this
export const productsService = {
  getProducts: (params = '') => fetchAPI(`/products${params}`),
  getProduct: (id) => fetchAPI(`/products/${id}`),
};

export const userService = {
  getProfile: (id, getToken) => fetchAPI(`/users/${id}`, { getToken }),
  updateCart: (id, cart, getToken) => fetchAPI(`/users/${id}/cart`, {
    method: 'PUT',
    body: JSON.stringify({ cart }),
    getToken
  }),
};
