// Centralized API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login/",
  REGISTER: "/auth/register/",
  PROFILE: "/auth/profile/",
  
  // Products
  PRODUCTS: "/products/",
  PRODUCT_DETAILS: (id: string | number) => `/products/${id}/`,
  CATEGORIES: "/categories/",
  
  // Cart
  CART: "/cart/",
};
